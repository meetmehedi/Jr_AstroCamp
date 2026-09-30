using System.Collections;
using UnityEngine;

namespace JrAstroCamp
{
    /// <summary>
    /// Free Fire / PUBG Style Combat & Mining Laser Controller.
    /// Handles Right-Click Aim Down Sights (ADS), hitscan laser raycast, and impact particles.
    /// </summary>
    public class ThirdPersonCombatController : MonoBehaviour
    {
        [Header("Weapon & Firing")]
        public Transform weaponMuzzle;
        public LineRenderer laserBeamRenderer;
        public ParticleSystem impactSparkPrefab;
        public AudioSource weaponAudioSource;
        public AudioClip laserSound;
        public AudioClip lootPickupSound;
        public float laserRange = 40f;
        public int laserDamage = 1;
        public float fireRate = 0.2f;

        [Header("Aim Down Sights (ADS)")]
        public Camera playerCamera;
        public float normalFOV = 60f;
        public float adsFOV = 36f;
        public float fovZoomSpeed = 12f;
        public GameObject crosshairUI;
        public GameObject adsReticleUI;
        public GameObject hitmarkerUI;

        private float nextFireTime;
        private bool isAiming;

        public bool IsAiming => isAiming;

        private void Update()
        {
            HandleAimDownSights();
            HandleShooting();
        }

        private void HandleAimDownSights()
        {
            // Right-click hold for ADS
            isAiming = Input.GetMouseButton(1);

            if (playerCamera != null)
            {
                float targetFOV = isAiming ? adsFOV : normalFOV;
                playerCamera.fieldOfView = Mathf.Lerp(playerCamera.fieldOfView, targetFOV, Time.deltaTime * fovZoomSpeed);
            }

            if (crosshairUI != null) crosshairUI.SetActive(!isAiming);
            if (adsReticleUI != null) adsReticleUI.SetActive(isAiming);
        }

        private void HandleShooting()
        {
            if (Input.GetMouseButton(0) && Time.time >= nextFireTime)
            {
                nextFireTime = Time.time + fireRate;
                FireMiningLaser();
            }
        }

        private void FireMiningLaser()
        {
            if (playerCamera == null) return;

            // Play firing audio
            if (weaponAudioSource != null && laserSound != null)
            {
                weaponAudioSource.PlayOneShot(laserSound);
            }

            // Raycast from camera center (crosshair target)
            Ray ray = playerCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0f));
            Vector3 targetPoint;

            if (Physics.Raycast(ray, out RaycastHit hit, laserRange))
            {
                targetPoint = hit.point;

                // Check if hit a Mineable Crystal Node
                MineableCrystal crystal = hit.collider.GetComponentInParent<MineableCrystal>();
                if (crystal != null)
                {
                    crystal.TakeMiningDamage(laserDamage, hit.point);
                    StartCoroutine(ShowHitmarker());
                }

                // Spawn impact sparks
                if (impactSparkPrefab != null)
                {
                    ParticleSystem spark = Instantiate(impactSparkPrefab, hit.point, Quaternion.LookRotation(hit.normal));
                    Destroy(spark.gameObject, 1.5f);
                }
            }
            else
            {
                targetPoint = ray.GetPoint(laserRange);
            }

            // Flash neon laser beam
            if (laserBeamRenderer != null && weaponMuzzle != null)
            {
                StartCoroutine(DrawLaserBeam(weaponMuzzle.position, targetPoint));
            }
        }

        private IEnumerator DrawLaserBeam(Vector3 start, Vector3 end)
        {
            laserBeamRenderer.enabled = true;
            laserBeamRenderer.SetPosition(0, start);
            laserBeamRenderer.SetPosition(1, end);
            yield return new WaitForSeconds(0.08f);
            laserBeamRenderer.enabled = false;
        }

        private IEnumerator ShowHitmarker()
        {
            if (hitmarkerUI != null)
            {
                hitmarkerUI.SetActive(true);
                yield return new WaitForSeconds(0.12f);
                hitmarkerUI.SetActive(false);
            }
        }
    }
}
