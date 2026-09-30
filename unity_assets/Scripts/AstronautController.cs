using UnityEngine;

namespace JrAstroCamp
{
    /// <summary>
    /// Free Fire / PUBG Style Third-Person Astronaut Controller
    /// Supports planetary low-gravity, sprint stamina, and jetpack flight boost.
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class AstronautController : MonoBehaviour
    {
        [Header("Movement & Speeds")]
        public float walkSpeed = 4.5f;
        public float sprintSpeed = 8.5f;
        public float rotationSmoothTime = 0.12f;

        [Header("Planetary Gravity & Jump")]
        [Tooltip("Earth is -9.81, Moon is -1.62, Mars is -3.72")]
        public float gravity = -3.5f;
        public float jumpHeight = 2.2f;

        [Header("Jetpack Flight Thrusters")]
        public float jetpackThrustForce = 7.0f;
        public float maxJetpackFuel = 100f;
        public float jetpackFuelDrainRate = 30f;
        public float jetpackFuelRechargeRate = 20f;
        public ParticleSystem[] jetpackThrusterEffects;
        public AudioSource thrusterAudioSource;

        [Header("Vitals & Stamina")]
        public float maxStamina = 100f;
        public float staminaDrainRate = 22f;
        public float staminaRechargeRate = 18f;

        // Public Telemetry Properties
        public float CurrentStamina { get; private set; }
        public float CurrentJetpackFuel { get; private set; }
        public bool IsGrounded => characterController.isGrounded;
        public bool IsSprinting { get; private set; }
        public bool IsJetpacking { get; private set; }

        private CharacterController characterController;
        private Transform cameraTransform;
        private Vector3 verticalVelocity;
        private float rotationVelocity;

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
            if (Camera.main != null)
            {
                cameraTransform = Camera.main.transform;
            }

            CurrentStamina = maxStamina;
            CurrentJetpackFuel = maxJetpackFuel;
        }

        private void Update()
        {
            HandleMovement();
            HandleJumpAndJetpack();
        }

        private void HandleMovement()
        {
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");
            Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;

            // Sprint handling
            bool wantsToSprint = Input.GetKey(KeyCode.LeftShift) && direction.magnitude > 0.1f;
            if (wantsToSprint && CurrentStamina > 5f)
            {
                IsSprinting = true;
                CurrentStamina = Mathf.Max(0f, CurrentStamina - staminaDrainRate * Time.deltaTime);
            }
            else
            {
                IsSprinting = false;
                CurrentStamina = Mathf.Min(maxStamina, CurrentStamina + staminaRechargeRate * Time.deltaTime);
            }

            float currentSpeed = IsSprinting ? sprintSpeed : walkSpeed;

            if (direction.magnitude >= 0.1f)
            {
                // Align movement to camera yaw
                float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
                float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref rotationVelocity, rotationSmoothTime);
                transform.rotation = Quaternion.Euler(0f, angle, 0f);

                Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
                characterController.Move(moveDir.normalized * (currentSpeed * Time.deltaTime));
            }
        }

        private void HandleJumpAndJetpack()
        {
            if (characterController.isGrounded)
            {
                if (verticalVelocity.y < 0)
                {
                    verticalVelocity.y = -2f;
                }

                // Recharge jetpack fuel when on ground
                CurrentJetpackFuel = Mathf.Min(maxJetpackFuel, CurrentJetpackFuel + jetpackFuelRechargeRate * Time.deltaTime);

                // Initial Jump Leap
                if (Input.GetButtonDown("Jump"))
                {
                    verticalVelocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
                }

                SetJetpackFlames(false);
            }
            else
            {
                // Airborne Jetpack Boost (Hold Space)
                if (Input.GetButton("Jump") && CurrentJetpackFuel > 2f)
                {
                    IsJetpacking = true;
                    verticalVelocity.y = Mathf.MoveTowards(verticalVelocity.y, jetpackThrustForce, Time.deltaTime * 18f);
                    CurrentJetpackFuel = Mathf.Max(0f, CurrentJetpackFuel - jetpackFuelDrainRate * Time.deltaTime);
                    SetJetpackFlames(true);

                    if (thrusterAudioSource != null && !thrusterAudioSource.isPlaying)
                    {
                        thrusterAudioSource.Play();
                    }
                }
                else
                {
                    IsJetpacking = false;
                    SetJetpackFlames(false);
                    if (thrusterAudioSource != null && thrusterAudioSource.isPlaying)
                    {
                        thrusterAudioSource.Stop();
                    }
                }
            }

            // Apply gravity
            verticalVelocity.y += gravity * Time.deltaTime;
            characterController.Move(verticalVelocity * Time.deltaTime);
        }

        private void SetJetpackFlames(bool active)
        {
            if (jetpackThrusterEffects == null) return;
            foreach (var fx in jetpackThrusterEffects)
            {
                if (fx == null) continue;
                if (active && !fx.isPlaying) fx.Play();
                if (!active && fx.isPlaying) fx.Stop();
            }
        }
    }
}
