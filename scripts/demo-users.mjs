// Demo logins for the LOCAL emulator only. These accounts never exist in the
// real Firebase project — real accounts are created by an Admin from the console.
//
// Members sign in with their mobile number; behind the scenes Firebase stores it
// as "<mobile>@member.wbpcc.org" (see memberEmail()).
export const memberEmail = (mobile) => `${String(mobile).replace(/\D/g, "").slice(-10)}@member.wbpcc.org`;

export const DEMO_USERS = [
  {
    key: "admin", role: "admin", name: "Office secretary (demo)", holder: "Office secretary",
    email: "admin@wbpcc.org", login: "admin@wbpcc.org", password: "demo-admin-123",
  },
  {
    key: "contributor", role: "contributor", name: "Contributor — Howrah (demo)", holder: "Contributor — Howrah",
    email: "contributor1@wbpcc.org", login: "contributor1@wbpcc.org", password: "demo-contrib-123",
  },
  {
    key: "member", role: "member", name: "Sample Member (demo)", memberId: "WB-HWH-YTH-0421",
    mobile: "9000000001", district: "howrah",
    email: memberEmail("9000000001"), login: "mobile 9000000001", password: "demo-member-123",
  },
];
