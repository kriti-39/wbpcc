/** @type {import('next').NextConfig} */
const nextConfig = {
  // English is the default language: "/" always opens "/en".
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      // These forms now live inside Contact ("Type of contact").
      { source: "/:lang(en|bn|hi)/help", destination: "/:lang/contact?type=help", permanent: true },
      { source: "/:lang(en|bn|hi)/volunteer", destination: "/:lang/contact?type=volunteer", permanent: true },
      { source: "/:lang(en|bn|hi)/petition-request", destination: "/:lang/contact?type=petition", permanent: true },
      // Supporter accounts were removed — visitors don't need to sign in.
      { source: "/:lang(en|bn|hi)/account", destination: "/:lang/signin", permanent: false },
    ];
  },
};

export default nextConfig;
