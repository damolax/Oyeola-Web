# Oyeola Web QA verification
Date: 2026-10-12

## Checked against GitHub source
- Nine showroom entries are linked in showroom/index.html.
- Concept pages: Modu Atelier, Arc & Acre, Stillform Pilates, Kindred Pet, Common Ground, Fieldnote Books.
- Client previews: Arbequina Apartment, Objects In Motion, Tillman Tough.
- Narrow-mobile media query improvements committed across all six concept sites and the showroom collection.
- Explicit DOM lookups fixed in Stillform class/timetable interaction and Kindred Pet guidance.
- Reduced-motion and keyboard focus styling enhanced in Stillform and Kindred Pet.

## Blocked
The connected live-browser QA run did not start due to insufficient TinyFish wallet credit. This means no claim is made that the deployed pages, mobile overflow, interaction behavior or external images were independently confirmed.

## Remaining live checks
1. Showroom and all nine links at 320, 375, 390, 430, 768, 1024, and 1440 CSS px.
2. Main showroom card contrast, navigation, filters, design notes modal and overlays.
3. Visual overflow and tap targets on all concept designs.
4. Working fit checker, project brief, class selector, vet guidance, café menu/event modal, reading match/shelf.
5. Client iframe loading versus direct-link fallback.
6. Keyboard focus, escape on dialogs, screen-reader labels and reduced-motion.
7. Contrast and image availability in both light and dark backgrounds.
8. Deployed commit parity and console/runtime errors.

Status: SOURCE-REVIEWED, NOT LIVE-ACCEPTED.
