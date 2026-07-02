import "./TeamSection.css";

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string; // Photo URL/path - Place in /public/team/ or reference external URLs
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
  },
  {
    name: "Ansh Srivastava",
    role: "Co-Founder & Technology Head",
    bio: "Architects the technology vision behind Verge Assure, translating complex insurance operations into scalable digital platforms.",
    image: "/team/ansh_srivastava.webp",
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
  },
  {
    name: "Vaibhav Chandra",
    role: "Advisory Board",
    image: "/team/vaibhav_chandra.webp",
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
                  member.name === "Vaibhav Chandra" ? "team-photo-vaibhav" : ""
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
          <div className="team-meta">
            <h3 className="team-name">{member.name}</h3>
            <span className={isLarge ? "founder-role" : "team-role"}>
              {member.role}
            </span>
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
