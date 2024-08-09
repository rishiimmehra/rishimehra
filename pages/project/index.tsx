import { pick } from "@contentlayer/client";
import { allProjects, Project } from ".contentlayer/generated";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import ProjectList from "components/projectlist";
import Input from "components/input";
import { useState } from "react";
import { IconSearch } from "components/Icons";

const seoTitle = "Project | Rishi Mehra";
const seoDesc =
  "I write about development, design, React, CSS, animation and more!";

type ProjectProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectProps) {
  const [search, setSearch] = useState("");
  const filteredProjects = projects.filter(({ title, description }) => {
    const searchString = `${title.toLowerCase()} ${description.toLowerCase()}`;
    return searchString.includes(search.toLowerCase());
  });

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        openGraph={{
          title: seoTitle,
          url: `https://samuelkraft.com/blog/`,
          description: seoDesc,
          site_name: "Samuel Kraft",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2">
            <h1 className="animate-in">Projects</h1>
            <p
              className="text-secondary animate-in"
              style={{ "--index": 1 } as React.CSSProperties}
            >
              I write about CSS, animation techniques, design systems and more.
            </p>
          </div>
          <div
            className="animate-in"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            <Input
              id="search"
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              pfix={<IconSearch className="w-5 h-5 text-secondary" />}
            />
          </div>
        </div>
        <div
          className="animate-in"
          style={{ "--index": 3 } as React.CSSProperties}
        >
          <ProjectList projects={filteredProjects} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const projects = allProjects
    .map((project) =>
      pick(project, ["slug", "title", "description", "time", "image"])
    );

  return {
    props: { projects },
  };
};
