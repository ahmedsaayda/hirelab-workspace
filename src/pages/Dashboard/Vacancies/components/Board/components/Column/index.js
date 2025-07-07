import React, { useState } from "react";
import { Badge, Button, Space } from "antd";
import { forwardRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FaFileImport } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { LuWorkflow } from "react-icons/lu";
import { MdDelete, MdPreview } from "react-icons/md";
import { PiExportFill } from "react-icons/pi";
import withDroppable from "../../../withDroppable";
import { pickPropOut } from "../../services/utils";
import Card from "./components/Card";
import CardAdder from "./components/CardAdder";

const ColumnEmptyPlaceholder = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ minHeight: "inherit", height: "inherit" }}
    {...props}
  />
));

const DroppableColumn = withDroppable(ColumnEmptyPlaceholder);

const colors = [
  "bg-[#7F56D9]",
  "bg-[#5207CD]",
  "bg-[#F75656]",
  "bg-[#EF6820]",
  "bg-[#0A8F63]",
];
function Column({
  children,
  index: columnIndex,
  renderCard,
  renderColumnHeader,
  disableColumnDrag,
  disableCardDrag,
  onCardNew,
  allowAddCard,
  loadMore,
  onCardOptionClick,
  VacancyId,
  columnId,
  title,
}) {
  const renderCount = () => {
    // when + 999, show 999+
    const count = children?.candidateCount ?? 0;
    return count > 999 ? "999+" : count;
  };
  return (
    <Draggable
      draggableId={`column-draggable-${children.id}`}
      index={columnIndex}
      isDragDisabled={disableColumnDrag}
    >
      {(columnProvided) => {
        const draggablePropsWithoutStyle = pickPropOut(
          columnProvided.draggableProps,
          "style"
        );

        return (
          <div
            ref={columnProvided.innerRef}
            {...draggablePropsWithoutStyle}
            style={{
              height: "100%",
              minHeight: "28px",
              display: "inline-block",
              verticalAlign: "top",

              ...columnProvided.draggableProps.style,
            }}
            className="react-kanban-column !bg-transparent"
            data-testid={`column-${children.id}`}
          >
            <div {...columnProvided.dragHandleProps}>
              <div className="mb-4 overflow-hidden bg-white rounded-md shadow-sm ">
                <div
                  /* top indicator colored based on column index */
                  className={`w-full h-1.5  ${
                    colors[columnIndex % colors.length]
                  }`}
                />
                <div className="flex items-start justify-between p-2">
                  {title ?? "Stage"}
                  <div className="flex justify-end w-full">
                    {/* <Badge
                   
                    count={children?.candidateCount ?? 0}
                    offset={[0, 0]}
                    overflowCount={999}
                  ></Badge> */}
                    <span className="flex items-center text[#667085] justify-center bg-gray-100 rounded-sm min-w-7 aspect-square">
                      {renderCount()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {allowAddCard && (
              <CardAdder column={children} onConfirm={onCardNew} />
            )}
            <DroppableColumn droppableId={String(children.id)}>
              {children.cards.length ? (
                children.cards.map((card, index) => (
                  <Card
                    key={card.id}
                    index={index}
                    renderCard={(dragging) =>
                      renderCard(children, card, dragging)
                    }
                    disableCardDrag={disableCardDrag}
                  >
                    {card}
                  </Card>
                ))
              ) : (
                <div className="react-kanban-card-skeleton" />
              )}

              {children.canLoadMore && (
                <Button onClick={loadMore}>Load More</Button>
              )}
            </DroppableColumn>
          </div>
        );
      }}
    </Draggable>
  );
}

export default Column;
