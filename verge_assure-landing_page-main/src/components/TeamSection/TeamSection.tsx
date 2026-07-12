import "./TeamSection.css";

import { LINKEDIN_URLS } from "../../../linkedin.config";

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string; // Photo URL/path - Place in /public/team/ or reference external URLs
  linkedin?: string;
}

// ──────────────────────────────────────────────────────────────────────
// TEAM DATA PLACEHOLDERS
// ──────────────────────────────────────────────────────────────────────
const CO_FOUNDERS: TeamMember[] = [
  {
    name: "Yash Chandra",
    role: "Founder & Business Head",
    bio: "Leads business growth with a problem-first understanding of insurance workflows, partnerships, and client delivery.",
    image: "/team/yash_chandra.webp",
    linkedin: LINKEDIN_URLS.yashChandra,
  },
  {
    name: "Ansh Srivastava",
    role: "Co-Founder & Technology Head",
    bio: "Architects the technology vision behind Verge Assure, translating complex insurance operations into scalable digital platforms.",
    image: "/team/ansh_srivastava.webp",
    linkedin: LINKEDIN_URLS.anshSrivastava,
  },
];

// const CONSULTANTS: TeamMember[] = [
//   {
//     name: 'Mr. Manoj Kumar Srivastava',
//     role: 'Insurance Industry Consultant',
//   },
//   {
//     name: 'Dr. Sanjay Kumar Srivastava',
//     role: 'Insurance Industry Consultant',
//   },
// ]

const CORE_TEAM: TeamMember[] = [
  {
    name: "Ayush Srivastava",
    role: "Advisory Board",
    image: "/team/ayush_srivastava.webp",
    linkedin: LINKEDIN_URLS.ayushSrivastava,
  },
  {
    name: "Vaibhav Chandra",
    role: "Advisory Board",
    image: "/team/vaibhav_chandra.webp",
    linkedin: LINKEDIN_URLS.vaibhavChandra,
  },
];

// ──────────────────────────────────────────────────────────────────────
// CARD SUBCOMPONENT
// ──────────────────────────────────────────────────────────────────────

// function Consultant({ member }: { member: TeamMember }) {
//   return (
//     <div className="consultant-item">
//       <h3>{member.name}</h3>
//       <span>{member.role}</span>
//     </div>
//   )
// }

function MemberCard({
  member,
  isLarge,
}: {
  member: TeamMember;
  isLarge?: boolean;
}) {
  return (
    <div className={`team-card ${isLarge ? "team-card--large" : ""}`}>
      <div className="team-card-inner">
        {/* Photo Section: Displays image, or falls back to a clean technical placeholder */}
        <div className="team-photo-container">
          <div className="team-photo-grid" /> {/* Technical grid overlay */}
          {member.image && (
            <div className="team-photo-container">
              <div className="team-photo-grid" />
              <img
                src={member.image}
                alt={member.name}
                className={`team-photo ${
                  member.name === "Vaibhav Chandra" ? "team-photo-vaibhav" :
                  member.name === "Yash Chandra" ? "team-photo-yash" :
                  member.name === "Ayush Srivastava" ? "team-photo-ayush" : ""
                }`}
              />
            </div>
          )}
        </div>

        {/* <div className="team-photo-placeholder">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="team-photo-hint">PLACE PHOTO HERE</span>
          </div> */}

        {/* Info & Details Section */}
        <div className="team-info">
          <div className="team-meta-row">
            <div className="team-meta-left">
              <h3 className="team-name">{member.name}</h3>
              <span className={isLarge ? "founder-role" : "team-role"}>
                {member.role}
              </span>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={isLarge ? "team-linkedin-icon-link-large" : "team-linkedin-icon-link-small"}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={isLarge ? "30" : "18"}
                  height={isLarge ? "30" : "18"}
                  fill="currentColor"
                  className="team-linkedin-svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
          {member.bio && <p className="team-bio">{member.bio}</p>}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// MAIN TEAM SECTION
// ──────────────────────────────────────────────────────────────────────
export function TeamSection() {
  return (
    <div id="team" className="team-wrapper">
      {/* Decorative background grid and ambient glows */}
      <div className="team-bg-glow team-bg-glow--left" />
      <div className="team-bg-glow team-bg-glow--right" />

      <div className="team-container">
        {/* Section Heading */}
        <div className="team-heading">
          <span className="team-label">OUR TEAM</span>
          <h2 className="team-title">
            The minds
            <br />
            behind the Verge.
          </h2>
          <div className="team-subtitle-row">
            <span className="team-subtitle-accent" />
            <p className="team-subtitle">
              Insurance innovators, legacy bridge architects, and systems
              engineers building the future of InsurTech.
            </p>
          </div>
        </div>

        {/* Co-Founders Row (Top Row - 2 large cards) */}
        <div className="team-founders-row">
          {CO_FOUNDERS.map((founder, i) => (
            <MemberCard key={i} member={founder} isLarge={true} />
          ))}
        </div>

        {/* Meet Our Guides */}
        <div className="team-guides-heading">
          <h3>Meet Our Guides</h3>
        </div>

        {/* Core Team Grid (Bottom Row - 5 standard cards) */}
        <div className="team-members-row">
          {CORE_TEAM.map((member, i) => (
            <MemberCard key={i} member={member} isLarge={false} />
          ))}
        </div>

        {/* Consultants - Names only */}
        {/* <div className="consultants-row">
  {CONSULTANTS.map((member, i) => (
    <Consultant key={i} member={member} />
  ))}
</div> */}

        {/* Technology Experts - Cards */}
        {/* <div className="team-members-row">
  {CORE_TEAM.map((member, i) => (
    <MemberCard key={i} member={member} isLarge={false} />
  ))}
</div> */}
      </div>
    </div>
  );
}
export default TeamSection;
