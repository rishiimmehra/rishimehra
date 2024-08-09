import { formatDate } from "lib/formatdate";
import type { Project } from ".contentlayer/generated";
import Section from "./Section";
import Link from "./Link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type ProjectProps = {
  project: Project;
  mousePosition?: {
    x: number;
    y: number;
  };
};

export default function Project({ project, mousePosition }: ProjectProps) {
  const { time, slug, title, image } = project;
  const publishDate = new Date(time);
  const showNewBadge =
    Math.abs(new Date(publishDate).getTime() - new Date().getTime()) /
      (24 * 60 * 60 * 1000) <
    30;
  const imageHeight = 150;
  const imageWidth = 300;
  const imageOffset = 22;

  return (
    <li className="py-2.5 group">
      <div className="transition-opacity">
        {image && mousePosition && (
          <motion.div
            animate={{
              top: mousePosition.y - imageHeight - imageOffset,
              left: mousePosition.x + imageOffset,
            }}
            initial={false}
            transition={{ ease: "easeOut" }}
            style={{ width: imageWidth, height: imageHeight }}
            className="absolute z-10 hidden overflow-hidden rounded shadow-sm pointer-events-none sm:group-hover:block bg-primary"
          >
            <Image
              src={image}
              alt={title}
              width={imageWidth}
              height={imageHeight}
            />
          </motion.div>
        )}
        <Section heading={formatDate(time)}>
          <Link href={`/project/${slug}`}>
            {title}
            {showNewBadge && (
              <span className="inline-block px-1.5 py-[1px] relative -top-[2px] font-bold ml-2 text-[10px] uppercase rounded-full brand-gradient text-white">
                New
              </span>
            )}
          </Link>
        </Section>
      </div>
    </li>
  );
}
