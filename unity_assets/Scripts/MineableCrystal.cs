using System.Collections;
using UnityEngine;

namespace JrAstroCamp
{
    public enum CrystalType
    {
        Helium3,
        WaterIce,
        TitaniumRegolith
    }

    /// <summary>
    /// Interactive Mineable Celestial Crystal Formation.
    /// Can be mined by the player's laser to yield Science points and mission loot.
    /// </summary>
    public class MineableCrystal : MonoBehaviour
    {
        [Header("Crystal Properties")]
        public string crystalName = "Helium-3 Fusion Crystal";
        public CrystalType crystalType = CrystalType.Helium3;
        public int maxHits = 3;
        public int scienceYield = 25;

        [Header("Visuals & Audio")]
        public Renderer[] crystalRenderers;
        public ParticleSystem shatterEffectPrefab;
        public AudioClip damageSound;
        public AudioClip extractLootSound;

        private int currentHits;
        private AudioSource audioSource;

        private void Awake()
        {
            currentHits = maxHits;
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null)
            {
                audioSource = gameObject.AddComponent<AudioSource>();
            }
        }

        public void TakeMiningDamage(int damage, Vector3 hitPoint)
        {
            currentHits -= damage;

            // Flash crystal emissive
            StartCoroutine(DamageFlash());

            if (damageSound != null && audioSource != null)
            {
                audioSource.PlayOneShot(damageSound);
            }

            if (currentHits <= 0)
            {
                HarvestCrystal();
            }
        }

        private IEnumerator DamageFlash()
        {
            if (crystalRenderers == null) yield break;

            foreach (var r in crystalRenderers)
            {
                if (r != null && r.material != null)
                {
                    r.material.EnableKeyword("_EMISSION");
                    r.material.SetColor("_EmissionColor", Color.white * 2.5f);
                }
            }

            yield return new WaitForSeconds(0.1f);

            foreach (var r in crystalRenderers)
            {
                if (r != null && r.material != null)
                {
                    Color normalColor = crystalType switch
                    {
                        CrystalType.Helium3 => new Color(0.2f, 0.7f, 1f),
                        CrystalType.WaterIce => new Color(0.4f, 0.9f, 0.95f),
                        _ => new Color(1f, 0.6f, 0.1f)
                    };
                    r.material.SetColor("_EmissionColor", normalColor * 0.8f);
                }
            }
        }

        private void HarvestCrystal()
        {
            if (shatterEffectPrefab != null)
            {
                ParticleSystem fx = Instantiate(shatterEffectPrefab, transform.position, Quaternion.identity);
                Destroy(fx.gameObject, 2.5f);
            }

            // Notify HUD & Game Manager
            TacticalSpaceHUD hud = FindFirstObjectByType<TacticalSpaceHUD>();
            if (hud != null)
            {
                hud.OnLootHarvested(crystalName, scienceYield);
            }

            Destroy(gameObject);
        }
    }
}
