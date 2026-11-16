import { Fragment } from "react";

/** Line composition from the pre-reduction editorial design at wide and narrow viewports.
 * Layout is explicit rather than depending on glyph size or container wrapping.
 * A normal space precedes each break so accessible names and textContent remain intact.
 */
const layouts: Record<string, [string[], string[]]> = {
  "Moments, beautifully remembered.": [
    [
      "Moments, beautifully",
      "remembered."
    ],
    [
      "Moments, beautifully",
      "remembered."
    ]
  ],
  "Digital that feels human.": [
    [
      "Digital that feels human."
    ],
    [
      "Digital that",
      "feels human."
    ]
  ],
  "Every frame has a story.": [
    [
      "Every frame has a story."
    ],
    [
      "Every frame",
      "has a story."
    ]
  ],
  "Identities with a point of view.": [
    [
      "Identities with a point of",
      "view."
    ],
    [
      "Identities with",
      "a point of view."
    ]
  ],
  "Creative that travels further.": [
    [
      "Creative that travels further."
    ],
    [
      "Creative that",
      "travels further."
    ]
  ],
  "Be the brand they remember.": [
    [
      "Be the brand they",
      "remember."
    ],
    [
      "Be the brand they",
      "remember."
    ]
  ],
  "Give your big idea a first impression worth keeping.": [
    [
      "Give your big",
      "idea a first",
      "impression",
      "worth keeping."
    ],
    [
      "Give your big",
      "idea a first",
      "impression",
      "worth keeping."
    ]
  ],
  "What services does Visual Verse offer?": [
    [
      "What services does",
      "Visual Verse offer?"
    ],
    [
      "What services does",
      "Visual Verse offer?"
    ]
  ],
  "What can we create together?": [
    [
      "What can we create",
      "together?"
    ],
    [
      "What can we create",
      "together?"
    ]
  ],
  "From big brands to founders' first ideas.": [
    [
      "From big brands to",
      "founders' first ideas."
    ],
    [
      "From big brands",
      "to founders' first",
      "ideas."
    ]
  ],
  "The short version.": [
    [
      "The short version."
    ],
    [
      "The short",
      "version."
    ]
  ],
  "What we bring to life.": [
    [
      "What we bring to life."
    ],
    [
      "What we bring to",
      "life."
    ]
  ],
  "Tell us about your project": [
    [
      "Tell us about your project"
    ],
    [
      "Tell us about your",
      "project"
    ]
  ],
  "The craft behind the work.": [
    [
      "The craft behind",
      "the work."
    ],
    [
      "The craft behind",
      "the work."
    ]
  ],
  "A little more clarity.": [
    [
      "A little more clarity."
    ],
    [
      "A little more",
      "clarity."
    ]
  ],
  "Often built together.": [
    [
      "Often built together."
    ],
    [
      "Often built",
      "together."
    ]
  ],
  "Frames that make the moment last.": [
    [
      "Frames that",
      "make the",
      "moment",
      "last."
    ],
    [
      "Frames that",
      "make the",
      "moment last."
    ]
  ],
  "Stories that move people.": [
    [
      "Stories",
      "that move",
      "people."
    ],
    [
      "Stories that",
      "move people."
    ]
  ],
  "Ideas that deserve to be seen.": [
    [
      "Ideas that",
      "deserve to",
      "be seen."
    ],
    [
      "Ideas that",
      "deserve to",
      "be seen."
    ]
  ],
  "Digital experiences built for real people.": [
    [
      "Digital",
      "experiences",
      "built for",
      "real people."
    ],
    [
      "Digital",
      "experiences",
      "built for",
      "real people."
    ]
  ],
  "Good stories deserve a bigger stage.": [
    [
      "Good stories",
      "deserve",
      "a bigger",
      "stage."
    ],
    [
      "Good stories",
      "deserve a",
      "bigger stage."
    ]
  ],
  "An identity that feels unmistakably yours.": [
    [
      "An identity",
      "that feels",
      "unmistakably",
      "yours."
    ],
    [
      "An identity",
      "that feels",
      "unmistakably",
      "yours."
    ]
  ],
  "Images that feel like you, long after the moment has passed.": [
    [
      "Images that feel like",
      "you, long after the",
      "moment has passed."
    ],
    [
      "Images that feel",
      "like you, long after",
      "the moment has",
      "passed."
    ]
  ],
  "Purposeful films that carry your story far beyond the screen.": [
    [
      "Purposeful films that",
      "carry your story far",
      "beyond the screen."
    ],
    [
      "Purposeful films",
      "that carry your",
      "story far beyond",
      "the screen."
    ]
  ],
  "Design that communicates before a single word is read.": [
    [
      "Design that",
      "communicates before",
      "a single word is read."
    ],
    [
      "Design that",
      "communicates",
      "before a single",
      "word is read."
    ]
  ],
  "A digital presence that looks exceptional and works beautifully everywhere.": [
    [
      "A digital presence",
      "that looks exceptional",
      "and works beautifully",
      "everywhere."
    ],
    [
      "A digital presence",
      "that looks",
      "exceptional and",
      "works beautifully",
      "everywhere."
    ]
  ],
  "A recognisable online presence that gives every post a purpose.": [
    [
      "A recognisable online",
      "presence that gives",
      "every post a purpose."
    ],
    [
      "A recognisable",
      "online presence",
      "that gives every",
      "post a purpose."
    ]
  ],
  "A brand system with the confidence to show up anywhere.": [
    [
      "A brand system with",
      "the confidence to",
      "show up anywhere."
    ],
    [
      "A brand system",
      "with the",
      "confidence to",
      "show up anywhere."
    ]
  ],
  "Is graphic design what you need?": [
    [
      "Is graphic design",
      "what you need?"
    ],
    [
      "Is graphic design",
      "what you need?"
    ]
  ],
  "Is photography what you need?": [
    [
      "Is photography",
      "what you need?"
    ],
    [
      "Is photography",
      "what you need?"
    ]
  ],
  "Is web & ui/ux design what you need?": [
    [
      "Is web & ui/ux",
      "design what you",
      "need?"
    ],
    [
      "Is web & ui/ux",
      "design what you",
      "need?"
    ]
  ],
  "Is videography what you need?": [
    [
      "Is videography",
      "what you need?"
    ],
    [
      "Is videography",
      "what you need?"
    ]
  ],
  "Is branding & identity what you need?": [
    [
      "Is branding &",
      "identity what you",
      "need?"
    ],
    [
      "Is branding &",
      "identity what you",
      "need?"
    ]
  ],
  "Is social media & digital marketing what you need?": [
    [
      "Is social media &",
      "digital marketing",
      "what you need?"
    ],
    [
      "Is social media &",
      "digital marketing",
      "what you need?"
    ]
  ],
  "From a creative brief to artwork that works.": [
    [
      "From a creative brief to artwork that works."
    ],
    [
      "From a creative brief",
      "to artwork that works."
    ]
  ],
  "From the first conversation to the final frame.": [
    [
      "From the first conversation to the final frame."
    ],
    [
      "From the first",
      "conversation to",
      "the final frame."
    ]
  ],
  "From the first wireframe to a better experience.": [
    [
      "From the first wireframe",
      "to a better experience."
    ],
    [
      "From the first wireframe",
      "to a better experience."
    ]
  ],
  "From the first idea to the final cut.": [
    [
      "From the first idea to the final cut."
    ],
    [
      "From the first idea",
      "to the final cut."
    ]
  ],
  "From your story to an identity that lasts.": [
    [
      "From your story to an identity that lasts."
    ],
    [
      "From your story to",
      "an identity that lasts."
    ]
  ],
  "From strategy to content that keeps evolving.": [
    [
      "From strategy to content that keeps evolving."
    ],
    [
      "From strategy to content",
      "that keeps evolving."
    ]
  ],
  "service-list:Web & UI/UX Design": [
    [
      "Web &",
      "UI/UX Design"
    ],
    [
      "Web &",
      "UI/UX Design"
    ]
  ],
  "service-list:Branding & Identity": [
    [
      "Branding",
      "& Identity"
    ],
    [
      "Branding",
      "& Identity"
    ]
  ],
  "service-list:Social Media & Digital Marketing": [
    [
      "Social Media &",
      "Digital Marketing"
    ],
    [
      "Social Media &",
      "Digital Marketing"
    ]
  ],
  "project-category:Web & UI/UX Design": [
    [
      "Web & UI/UX",
      "Design"
    ],
    [
      "Web & UI/UX",
      "Design"
    ]
  ],
  "project-category:Branding & Identity": [
    [
      "Branding &",
      "Identity"
    ],
    [
      "Branding &",
      "Identity"
    ]
  ],
  "project-category:Social Media & Digital Marketing": [
    [
      "Social Media &",
      "Digital Marketing"
    ],
    [
      "Social Media &",
      "Digital Marketing"
    ]
  ],
  "project-focus:Social Media & Digital Marketing": [
    [
      "Social Media & Digital",
      "Marketing"
    ],
    [
      "Social Media & Digital",
      "Marketing"
    ]
  ]
};

export function EditorialText({text, variant}:{text:string;variant?:string}) {
  const layout = layouts[(variant ? variant + ":" : "") + text] ?? layouts[text];
  if (!layout) return <>{text}</>;
  const breaks = (lines:string[]) => new Set(lines.slice(0,-1).map((_,i)=>lines.slice(0,i+1).join(" ").split(" ").length));
  const wide = breaks(layout[0]), narrow=breaks(layout[1]);
  return <>{text.split(" ").map((word,i)=>{
    const w=wide.has(i),n=narrow.has(i);
    return <Fragment key={i}>{i>0 && " "}{w||n ? <br className={w&&n ? undefined : w ? "vv-break-wide" : "vv-break-narrow"}/> : null}{word}</Fragment>;
  })}</>;
}
