import qs from "qs";

import { BlockRenderer, TeamPageBlock } from "@/app/components/blocks";
import Link from "next/link";
import Image from "next/image";

async function getTeamMember(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
      blocks: {
        on: {
          "blocks.testimonial": {
            populate: {
              photo: {
                fields: ["alternativeText", "name", "url"],
              },
            },
          },
          "blocks.spoiler": {
            populate: true,
          },
          "blocks.rich-text": {
            populate: true,
          },
          "blocks.accordion": {
            populate: true,
          },
        },
      },
    },
    filters: {
      slug: {
        $eq: slug, // This is the slug for our team member
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  const teamMember = data?.data[0];
  //console.dir(teamMember, { depth: null });
  return teamMember;
}

interface UserProfile {
  id: number;
  documentId: string;
  name: string;
  position: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  photo: {
    id: number;
    alternativeText: string;
    name: string;
    url: string;
  };
  blocks: TeamPageBlock[];
}

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

export default async function TeamMemberDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) return <p>No member found</p>;

  const teamMember = (await getTeamMember(slug)) as UserProfile;

  return (
    <>
      <div className="prose max-w-none">
        {/* final stage create 2 divs the first one will be the banner div and second will be our content div with prose */}
        <div className="text-white relative bg-gray-700 px-14 py-14 sm:py-24 -mx-12 -mt-7 border-spacing-0">
          <h2 className="text-3xl md:text-6xl font-bold relative z-10">
            {teamMember.name}
          </h2>
          <h4 className="text-base md:text-2xl font-bold relative z-10">
            {teamMember.position}
          </h4>
          {/* <img
            className="object-cover absolute top-0 bottom-0 left-1/2 right-0 block w-1/2 h-full opacity-50 filter grayscale"
            //src={` ${"http://localhost:1337"}${teamMember.photo.url}`}
            src={teamMember.photo.url}
          /> */}
          <Image
            src={teamMember.photo.url}
            alt={teamMember.photo.alternativeText}
            width={580}
            height={400}
            className="object-cover absolute top-0 bottom-0 left-1/2 right-0 block w-1/2 h-full opacity-50 filter grayscale"
          />
          <div className="absolute z-0 w-80 bg-gradient-to-r from-gray-700 to-transparent h-full top-0 bottom-0 left-1/2 right-0"></div>
        </div>

        <div className="transform -translate-y-1/2">
          <Link
            href="/our-team"
            className=" z-30 text-sm bg-orange-500 text-white hover:bg-slate-500 hover:text-white inline-block rounded-lg py-3 px-5"
          >
            &laquo; Team members
          </Link>
        </div>

        <div className="prose max-w-none">
          {teamMember.blocks.map((block: TeamPageBlock) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </>
  );
}
