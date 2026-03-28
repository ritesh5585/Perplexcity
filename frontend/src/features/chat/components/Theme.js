const getTheme = (isDark) => ({
  // const bgMain = "relative min-h-screen w-full",
  bgMain: isDark ? "bg-[#0b0d14]" : "bg-[#f8f9fb]",
  bgSidebar: isDark ? "bg-[#10131c]" : "bg-white",
  bgInput: isDark ? "bg-[#064059]" : "bg-white",
  bgItemHover: isDark ? "hover:bg-white/5" : "hover:bg-black/5",
  bgItemActive: isDark ? "bg-white/5" : "bg-black/5",
  textMain: isDark ? "text-[#e8e8ec]" : "text-[#1a1a2e]",
  textMuted: isDark ? "text-white/50" : "text-black/50",
  borderMain: isDark ? "border-white/15" : "border-black/15",
  btnPrimary: isDark
    ? "bg-white text-black hover:bg-white/90"
    : "bg-black text-white hover:bg-black/80",
  userMsgBg: isDark ? "bg-white/10 text-white" : "bg-black/5 text-black",
  aiMsgText: isDark ? "text-white/90" : "text-black/90",
});

export default getTheme 