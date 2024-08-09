import type { Project as ProjectType } from ".contentlayer/generated";
import Project from "components/Project";
import React, { useRef, useState } from "react";

function getRelativeCoordinates(
  event: React.MouseEvent<HTMLUListElement>,
  referenceElement: any
) {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.clientTop,
    width: referenceElement.clientWidth,
    height: referenceElement.clientHeight,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  };
}

type ProjectListProps = {
  projects: ProjectType[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  const [mousePosition, setMousePosition] = useState({
    x: 240,
    y: 0,
  });
  const listRef = useRef(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    setMousePosition(getRelativeCoordinates(e, listRef.current));
  };

  return (
    <ul
      ref={listRef}
      onMouseMove={(e) => handleMouseMove(e)}
      className="flex flex-col animated-list"
    >
      {projects.length === 0 && <p>No projects found</p>}
      {projects.map((project) => (
        <Project key={project.slug} project={project} mousePosition={mousePosition} />
      ))}
    </ul>
  );
}
