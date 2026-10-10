/* =====================================================================
   EDIT YOUR VIDEOS, PHOTOS AND LINKS HERE
   ---------------------------------------------------------------------
   Each video can play in three ways. Fill in ONE of these:
     youtube: "dQw4w9WgXcQ"        -> the ID after "v=" in a YouTube link. Plays on your site.
     mp4:     "videos/clip.mp4"    -> a video file in the /videos folder (under 25 MB). Plays on your site.
     link:    "https://..."        -> any other post (Instagram, LinkedIn, X). Opens in a new tab.
   thumb   = the cover image, in the /images folder.
   preview = optional short silent .mp4 that plays when someone hovers.

   To add a video: copy one { ... }, block, paste it, change the details.
   Newest first: the first item shows first.
   Keep the commas between blocks.
   ===================================================================== */

window.SITE = {

  linkedin: "",                                 // e.g. "https://www.linkedin.com/in/your-profile"
  cv:       "Raja_Venkatapathy_Mani_CV.pdf",    // your CV file, placed next to index.html
  wakelet:  "https://wakelet.com/wake/-hoKD1NmWkkzTqJGR6X56",

  /* ---- 1. LATEST WORK: big video slider at the top (5 or more) ---- */
  latest: [
    { title: "Your newest piece", date: "Month Year",
      tags: ["Reel", "Climate", "Instagram"],
      role: "Concept, script and edit for UNDP's global Instagram",
      result: "1.2M views",
      thumb: "images/latest-01.jpg", youtube: "", mp4: "", link: "", preview: "" },

    { title: "Second piece", date: "Month Year",
      tags: ["Explainer", "Gender equality", "YouTube"],
      role: "Your role in one line", result: "",
      thumb: "images/latest-02.jpg", youtube: "", mp4: "", link: "", preview: "" },

    { title: "Third piece", date: "Month Year",
      tags: ["Film", "Crisis", "LinkedIn"],
      role: "Your role in one line", result: "",
      thumb: "images/latest-03.jpg", youtube: "", mp4: "", link: "", preview: "" },

    { title: "Fourth piece", date: "Month Year",
      tags: ["Campaign", "Oceans", "Instagram"],
      role: "Your role in one line", result: "",
      thumb: "images/latest-04.jpg", youtube: "", mp4: "", link: "", preview: "" },

    { title: "Fifth piece", date: "Month Year",
      tags: ["Reel", "Global Goals", "Instagram"],
      role: "Your role in one line", result: "",
      thumb: "images/latest-05.jpg", youtube: "", mp4: "", link: "", preview: "" }
  ],

  /* ---- 2. VIDEO WALL: vertical Reels slider (6 or more) ---- */
  reels: [
    { title: "Reel title", tag: "Climate",        thumb: "images/reel-01.jpg", youtube: "", mp4: "", link: "" },
    { title: "Reel title", tag: "Gender",         thumb: "images/reel-02.jpg", youtube: "", mp4: "", link: "" },
    { title: "Reel title", tag: "Poverty",        thumb: "images/reel-03.jpg", youtube: "", mp4: "", link: "" },
    { title: "Reel title", tag: "Crisis",         thumb: "images/reel-04.jpg", youtube: "", mp4: "", link: "" },
    { title: "Reel title", tag: "Oceans",         thumb: "images/reel-05.jpg", youtube: "", mp4: "", link: "" },
    { title: "Reel title", tag: "Global Goals",   thumb: "images/reel-06.jpg", youtube: "", mp4: "", link: "" }
  ],

  /* ---- 3. PHOTO SLIDER: in the About section ---- */
  photos: [
    { src: "images/field-01.jpg", caption: "Antarctic Peninsula" },
    { src: "images/field-02.jpg", caption: "Salar de Uyuni, Bolivia" },
    { src: "images/field-03.jpg", caption: "Laguna Esmeralda, Tierra del Fuego, Argentina" },
    { src: "images/field-04.jpg", caption: "Antarctica" },
    { src: "images/field-05.jpg", caption: "Lençóis Maranhenses, Brazil" },
    { src: "images/field-06.jpg", caption: "White rhinos, Southern Africa" }
  ],

  /* ---- 4. OTHER PHOTOS ---- */
  portrait: "images/portrait.jpg",   // your main photo at the top of the page
  travel: "images/travel.jpg",
  caseImages: {
    undpGlobal: "images/case-undp-global.jpg",
    undpIndia:  "images/case-undp-india.jpg",
    deported:   "images/case-deported.jpg",
    counting:   "images/case-14000.jpg",
    syria:      "images/case-syria.jpg"
  }
};
