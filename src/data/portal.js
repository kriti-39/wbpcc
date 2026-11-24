// =====================================================================
// DEMO DATA for My account + the member portal. Phase 2: comes from the
// database for whoever is signed in. Member data shown here is only what
// the member themselves may see — never other members.
// =====================================================================

export const demoMember = {
  id: "WB-HWH-YTH-0421",
  district: "howrah",
  group: "youth-congress",
  day: 12,
  since: "2026-11-11",
  eventsAttended: 3,
  upcoming: ["price-rise-survey-howrah", "jobs-for-youth-rally", "students-career-fair"],
};

export const announcements = [
  {
    id: "a1", date: "2026-11-23",
    from: { en: "Howrah District Committee", bn: "হাওড়া জেলা কমিটি", hi: "हावड़ा ज़िला कमेटी" },
    text: {
      en: "Door-to-door price survey this Sunday — meet at the Shibpur office at 9 AM.",
      bn: "এই রবিবার বাড়ি বাড়ি মূল্যবৃদ্ধি সমীক্ষা — সকাল ৯টায় শিবপুর কার্যালয়ে জমায়েত।",
      hi: "इस रविवार घर-घर महँगाई सर्वे — सुबह 9 बजे शिबपुर कार्यालय में मिलें।",
    },
  },
  {
    id: "a2", date: "2026-11-22",
    from: { en: "Youth Wing", bn: "যুব শাখা", hi: "युवा शाखा" },
    text: {
      en: "A new placard template for the Jobs for Youth rally is ready in Printables.",
      bn: "যুবদের কাজের সমাবেশের নতুন প্ল্যাকার্ড টেমপ্লেট প্রিন্টেবলে তৈরি।",
      hi: "युवा रोज़गार रैली का नया प्लेकार्ड टेम्पलेट प्रिंटेबल्स में तैयार है।",
    },
  },
  {
    id: "a3", date: "2026-11-20",
    from: { en: "State leadership", bn: "রাজ্য নেতৃত্ব", hi: "राज्य नेतृत्व" },
    text: {
      en: "Reminder: every protest must stay peaceful. Report any trouble to your district coordinator.",
      bn: "মনে রাখবেন: প্রতিটি প্রতিবাদ শান্তিপূর্ণ রাখতে হবে। কোনো সমস্যা হলে জেলা সমন্বয়ককে জানান।",
      hi: "याद रखें: हर विरोध शांतिपूर्ण रहे। कोई दिक़्क़त हो तो ज़िला समन्वयक को बताएँ।",
    },
  },
];

// status: review | approved | changes | rejected
export const submissions = [
  {
    id: "s1", kind: "report", status: "approved", date: "2026-11-21", link: "/newsroom/howrah-waterlogging",
    title: { en: "Ward 12 still waterlogged after 9 days", bn: "৯ দিন পরেও ১২ নম্বর ওয়ার্ডে জমা জল", hi: "9 दिन बाद भी वार्ड 12 में जलभराव" },
  },
  {
    id: "s2", kind: "petition", status: "approved", date: "2026-11-12", link: "/petitions/repair-shibpur-road",
    title: { en: "Repair the Shibpur–Santragachi road", bn: "শিবপুর–সাঁতরাগাছি রাস্তা সারান", hi: "शिबपुर–संतरागाछी सड़क की मरम्मत करें" },
  },
  {
    id: "s3", kind: "event", status: "review", date: "2026-11-23",
    title: { en: "Street-corner meeting in Shibpur", bn: "শিবপুরে পথসভা", hi: "शिबपुर में नुक्कड़ सभा" },
  },
  {
    id: "s4", kind: "campaign", status: "changes", date: "2026-11-19",
    title: { en: "Clean-water drive in Ward 9", bn: "৯ নম্বর ওয়ার্ডে পরিষ্কার জলের অভিযান", hi: "वार्ड 9 में साफ़ पानी अभियान" },
    note: { en: "Add the date and who will lead it.", bn: "তারিখ ও কে নেতৃত্ব দেবেন তা যোগ করুন।", hi: "तारीख़ और कौन नेतृत्व करेगा, यह जोड़ें।" },
  },
  {
    id: "s5", kind: "report", status: "rejected", date: "2026-11-15",
    title: { en: "Street lights off on GT Road", bn: "জিটি রোডে পথবাতি বন্ধ", hi: "जीटी रोड पर स्ट्रीट लाइट बंद" },
    note: { en: "We couldn't verify it — please add a photo or video.", bn: "যাচাই করা যায়নি — একটি ছবি বা ভিডিও যোগ করুন।", hi: "सत्यापित नहीं हो सका — कृपया फ़ोटो या वीडियो जोड़ें।" },
  },
];

export const supporterDemo = {
  signatures: [
    { petition: "fill-teacher-posts", date: "2026-11-20" },
    { petition: "tea-garden-fair-wage", date: "2026-11-22" },
  ],
  rsvps: ["jobs-for-youth-rally", "womens-safety-barasat"],
  tickets: [
    {
      id: "WB-482913", status: "progress", date: "2026-11-18", topic: "complaint",
      title: { en: "Broken handpump in our para", bn: "আমাদের পাড়ায় নলকূপ খারাপ", hi: "हमारे मोहल्ले का हैंडपंप ख़राब" },
    },
    {
      id: "WB-120554", status: "resolved", date: "2026-11-05", topic: "help",
      title: { en: "Help with a hospital admission", bn: "হাসপাতালে ভর্তিতে সাহায্য", hi: "अस्पताल में भर्ती में मदद" },
    },
  ],
};
