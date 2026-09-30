using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace JrAstroCamp
{
    /// <summary>
    /// Free Fire / PUBG Battle Royale Style Tactical Space HUD.
    /// Manages 360-degree top compass ribbon, health/armor bars, jetpack fuel, and loot feed.
    /// </summary>
    public class TacticalSpaceHUD : MonoBehaviour
    {
        [Header("Compass Ribbon")]
        public Transform playerCameraTransform;
        public Text compassDegreeText;
        public RawImage compassRibbonImage;

        [Header("Vitals Bars")]
        public AstronautController playerController;
        public Slider armorSlider;
        public Slider staminaSlider;
        public Slider jetpackFuelSlider;
        public Text sciencePointsText;

        [Header("Action / Loot Feed")]
        public Transform feedContainer;
        public GameObject feedItemPrefab;
        public AudioClip lootFanfareClip;

        private int totalScienceScore = 0;
        private AudioSource audioSource;

        private void Awake()
        {
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null) audioSource = gameObject.AddComponent<AudioSource>();
        }

        private void Update()
        {
            UpdateCompass();
            UpdateVitals();
        }

        private void UpdateCompass()
        {
            if (playerCameraTransform == null) return;

            float heading = playerCameraTransform.eulerAngles.y;
            string cardinal = GetCardinalDirection(heading);

            if (compassDegreeText != null)
            {
                compassDegreeText.text = $"{Mathf.RoundToInt(heading)}° {cardinal}";
            }

            // Scroll compass ribbon texture coordinates if UV rect is assigned
            if (compassRibbonImage != null)
            {
                compassRibbonImage.uvRect = new Rect(heading / 360f, 0f, 1f, 1f);
            }
        }

        private void UpdateVitals()
        {
            if (playerController == null) return;

            if (staminaSlider != null)
            {
                staminaSlider.value = playerController.CurrentStamina / playerController.maxStamina;
            }

            if (jetpackFuelSlider != null)
            {
                jetpackFuelSlider.value = playerController.CurrentJetpackFuel / playerController.maxJetpackFuel;
            }
        }

        public void OnLootHarvested(string crystalName, int points)
        {
            totalScienceScore += points;

            if (sciencePointsText != null)
            {
                sciencePointsText.text = $"{totalScienceScore} SCIENCE";
            }

            if (lootFanfareClip != null && audioSource != null)
            {
                audioSource.PlayOneShot(lootFanfareClip);
            }

            StartCoroutine(SpawnFeedMessage($"💎 Mined {crystalName} (+{points} Science)"));
        }

        private IEnumerator SpawnFeedMessage(string message)
        {
            if (feedContainer == null || feedItemPrefab == null) yield break;

            GameObject item = Instantiate(feedItemPrefab, feedContainer);
            Text textComponent = item.GetComponentInChildren<Text>();
            if (textComponent != null)
            {
                textComponent.text = message;
            }

            yield return new WaitForSeconds(4f);
            Destroy(item);
        }

        private string GetCardinalDirection(float degrees)
        {
            if (degrees >= 337.5f || degrees < 22.5f) return "N";
            if (degrees < 67.5f) return "NE";
            if (degrees < 112.5f) return "E";
            if (degrees < 157.5f) return "SE";
            if (degrees < 202.5f) return "S";
            if (degrees < 247.5f) return "SW";
            if (degrees < 292.5f) return "W";
            return "NW";
        }
    }
}
