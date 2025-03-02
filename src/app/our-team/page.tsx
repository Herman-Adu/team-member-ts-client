import qs from "qs";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  const membersPromise = await fetch(
    process.env.NEXT_PUBLIC_STRAPI_URL + "/api/team-members?fields[0]=slug"
  );

  const members = await membersPromise.json();

  return members.data.map((member: { slug: string }) => {
    return {
      slug: member.slug,
    };
  });
}

async function getTeamMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
      blocks: {},
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  //console.log(data);

  return data;
}

interface TeamMemberProps {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  photo: {
    id: number;
    documentId: string;
    alternativeText: string;
    name: string;
    url: string;
  };
}

function TeamMemberCard({
  name,
  description,
  position,
  photo,
  slug,
}: Readonly<TeamMemberProps>) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${photo.url}`;

  return (
    <Link
      href={`/our-team/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Image
        src={photo.url}
        alt={photo.alternativeText || name}
        width={580}
        height={400}
      />
      <div className="richtext flex flex-col sm:flex-row sm:justify-between sm:items-center pl-6 pr-6 pt-6">
        <h5 className="richtext font-semibold ">{name}</h5>
        <h6 className="richtext">{position}</h6>
      </div>
      <div className=" richtext pl-6 pr-6">
        <p className="richtext">{description}</p>
      </div>
    </Link>
  );
}

export default async function OurTeam() {
  const teamMembers = await getTeamMembers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {teamMembers.data.map((member: TeamMemberProps) => (
          <TeamMemberCard key={member.documentId} {...member} />
        ))}
      </div>
    </div>
  );
}
