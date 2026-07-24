
- Fetched and integrated the `configuration.unlimited_mentor_slot` setting from the settings API in `AvailabilityPopup.tsx`.
- Applied conditional logic to the booking system:
  - If `unlimited_mentor_slot === 1`, users can add unlimited availability slots.
  - If `unlimited_mentor_slot === 0`, users are restricted to a monthly limit of 120 minutes (2 hours).
- Updated the UI to reflect the current booking status (Monthly Quota vs Unlimited Booking Available).
