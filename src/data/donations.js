// src/data/donations.js
//
// Shared fallback donation programs.
// Imported by:
//   • src/components/Donations.jsx     (renders if backend is empty)
//   • src/components/AdminPortal.jsx   (used by "Seed Donations" button)

export const FALLBACK_DONATION_PROGRAMS = [
  {
    id: 1,
    title: "Academic Sponsorships",
    description:
      "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
    image: "/Madison_Hannah Sponsorship.png",
    images: [
      "/Madison_Hannah Sponsorship.png",
      "/Charlotte_Aurora Sponsorship.png",
      "/Amelia_Hazel Sponsorship.png",
      "/Sponsorship Melbourne.png",
      "/Sponsorship Metro.png",
      "/Lighting up the world.jpg",
    ],
    quote:
      "“Before this sponsorship, I had given up on ever returning to school. Now I’m in my second year of college, pursuing a degree in education—a dream I once thought was impossible. The support didn’t just pay my fees; it restored my confidence and gave me a clear path forward. I want every young person in my community to know that with the right opportunity, their future is within reach.”",
    quoteName: "—Juliana George,",
    quotePosition: "Academic Sponsorship Beneficiary",
    overlayImage: "/IMG_185101_26326_1774540300928.jpg",
  },
  {
    id: 2,
    title: "Palliative Care Support",
    description:
      "We provide home-based care, medical assistance, daily necessities, and moral support for the elderly and those with chronic illnesses — ensuring dignity, comfort, and emotional well-being.",
    image: "/Palliative Outreach 14.jpg",
    images: [
      "/Palliative Outreach 13.jpg",
      "/Palliative Outreach 14.jpg",
      "/Palliative Outreach 11.jpg",
      "/Community Project Theme.jpg",
    ],
    quote:
      "“When the Foundation first came to our home, I was exhausted and had lost hope. They didn't just bring medication—they brought prayer, encouragement, and a gentle presence that lifted my spirit. They taught my family how to care for me, checked on us every week, and even helped arrange a wheelchair so I could sit outside again. Now I feel seen, supported, and at peace. This program gave us back our dignity.”",
    quoteName: "—Elena Martinez,",
    quotePosition: "Palliative Care Recipient",
    overlayImage: "/Palliative Outreach 12.jpg",
  },
  {
    id: 3,
    title: "Community Projects",
    description:
      "We have partnered with the local churches and associations to support children's homes through feeding programs, school supplies (books, uniforms, tuition), talent discovery workshops, and ongoing mentorship — empowering every child to grow, learn, and thrive.",
    image: "/Community Outreach 2.jpg",
    images: [
      "/Community Outreach 1.jpg",
      "/Community Outreach 4.jpg",
      "/Children Orphanage 1.jpg",
      "/Community Outreach 3.jpg",
      "/Outreach team - USA.jpg",
      "/Community Outreach2.jpg",
    ],
    quote:
      "“Goodwillstores continues to walk alongside our children's home—providing food, clothing, and school essentials while also investing in our children's gifts. We run weekend workshops where our kids explore art, music, and even basic coding. Our kids now attend school with confidence. The team visits regularly, offering mentorship and helping us build life skills. It's not just support—it's a partnership in building a brighter future.”",
    quoteName: "—Mellisa Marie ,",
    quotePosition: "Community Project Coordinator",
    overlayImage: "/Outreach theme1.jpg",
  },
];
