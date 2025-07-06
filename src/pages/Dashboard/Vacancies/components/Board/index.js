import { forwardRef, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import CrudService from "../../../../../services/CrudService";
import withDroppable from "../withDroppable";
import Column from "./components/Column";
import ColumnAdder from "./components/ColumnAdder";
import DefaultCard from "./components/DefaultCard";
import DefaultColumnHeader from "./components/DefaultColumnHeader";
import {
  getCard,
  getCoordinates,
  isAColumnMove,
  isMovingACardToAnotherPosition,
  isMovingAColumnToAnotherPosition,
} from "./services";
import {
  addCard,
  addColumn,
  changeColumn,
  moveCard,
  moveColumn,
  removeCard,
  removeColumn,
} from "./services/helpers";
import { partialRight, when } from "./services/utils";

const Columns = forwardRef((props, ref) => (
  <div ref={ref} style={{ whiteSpace: "nowrap" }} {...props} />
));

const DroppableBoard = withDroppable(Columns);

function Board(props) {
  return props.initialBoard ? (
    <UncontrolledBoard {...props} />
  ) : (
    <ControlledBoard {...props} />
  );
}

function UncontrolledBoard({
  initialBoard,
  onCardDragEnd,
  onColumnDragEnd,
  allowAddColumn,
  renderColumnAdder,
  onNewColumnConfirm,
  onColumnRemove,
  renderColumnHeader,
  allowRemoveColumn,
  allowRenameColumn,
  onColumnRename,
  onCardNew,
  renderCard,
  allowRemoveCard,
  onCardRemove,
  onColumnNew,
  disableCardDrag,
  disableColumnDrag,
  allowAddCard,
  onNewCardConfirm,
}) {
  const [board, setBoard] = useState(initialBoard);
  const handleOnCardDragEnd = partialRight(handleOnDragEnd, {
    moveCallback: moveCard,
    notifyCallback: onCardDragEnd,
  });
  const handleOnColumnDragEnd = partialRight(handleOnDragEnd, {
    moveCallback: moveColumn,
    notifyCallback: onColumnDragEnd,
  });

  function handleOnDragEnd(
    { source, destination, subject },
    { moveCallback, notifyCallback }
  ) {
    const reorderedBoard = moveCallback(board, source, destination);
    when(notifyCallback)((callback) =>
      callback(reorderedBoard, subject, source, destination)
    );
    setBoard(reorderedBoard);
  }

  async function handleColumnAdd(newColumn) {
    const column = renderColumnAdder
      ? newColumn
      : await onNewColumnConfirm(newColumn);
    const boardWithNewColumn = addColumn(board, column);
    onColumnNew(boardWithNewColumn, column);
    setBoard(boardWithNewColumn);
  }

  function handleColumnRemove(column) {
    const filteredBoard = removeColumn(board, column);
    onColumnRemove(filteredBoard, column);
    setBoard(filteredBoard);
  }

  function handleColumnRename(column, title) {
    const boardWithRenamedColumn = changeColumn(board, column, { title });
    onColumnRename(boardWithRenamedColumn, { ...column, title });
    setBoard(boardWithRenamedColumn);
  }

  function handleCardAdd(column, card, options = {}) {
    const boardWithNewCard = addCard(board, column, card, options);

    onCardNew(
      boardWithNewCard,
      boardWithNewCard.columns.find(({ id }) => id === column.id),
      card
    );
    setBoard(boardWithNewCard);
  }

  async function handleDraftCardAdd(column, card, options = {}) {
    const newCard = await onNewCardConfirm(card);
    handleCardAdd(column, newCard, options);
  }

  function handleCardRemove(column, card) {
    const boardWithoutCard = removeCard(board, column, card);
    onCardRemove(
      boardWithoutCard,
      boardWithoutCard.columns.find(({ id }) => id === column.id),
      card
    );
    setBoard(boardWithoutCard);
  }

  return (
    <BoardContainer
      onCardDragEnd={handleOnCardDragEnd}
      onColumnDragEnd={handleOnColumnDragEnd}
      renderColumnAdder={() => {
        if (!allowAddColumn) return null;
        if (renderColumnAdder)
          return renderColumnAdder({ addColumn: handleColumnAdd });
        if (!onNewColumnConfirm) return null;
        return (
          <ColumnAdder
            onConfirm={(title) => handleColumnAdd({ title, cards: [] })}
          />
        );
      }}
      {...(renderColumnHeader && {
        renderColumnHeader: (column) =>
          renderColumnHeader(column, {
            removeColumn: handleColumnRemove.bind(null, column),
            renameColumn: handleColumnRename.bind(null, column),
            addCard: handleCardAdd.bind(null, column),
          }),
      })}
      renderCard={(column, card, dragging) => {
        if (renderCard)
          return renderCard(card, {
            removeCard: handleCardRemove.bind(null, column, card),
            dragging,
          });
        return (
          <DefaultCard
            dragging={dragging}
            allowRemoveCard={allowRemoveCard}
            onCardRemove={(card) => handleCardRemove(column, card)}
          >
            {card}
          </DefaultCard>
        );
      }}
      allowRemoveColumn={allowRemoveColumn}
      onColumnRemove={handleColumnRemove}
      allowRenameColumn={allowRenameColumn}
      onColumnRename={handleColumnRename}
      disableColumnDrag={disableColumnDrag}
      disableCardDrag={disableCardDrag}
      onCardNew={(column, card) =>
        handleDraftCardAdd(column, card, allowAddCard)
      }
      allowAddCard={allowAddCard && onNewCardConfirm}
    >
      {board}
    </BoardContainer>
  );
}

function ControlledBoard({
  children: board,
  onCardDragEnd,
  onColumnDragEnd,
  allowAddColumn,
  renderColumnAdder,
  onNewColumnConfirm,
  onColumnRemove,
  renderColumnHeader,
  allowRemoveColumn,
  allowRenameColumn,
  onColumnRename,
  renderCard,
  allowRemoveCard,
  onCardRemove,
  disableCardDrag,
  disableColumnDrag,
  onCardOptionClick,
  loadMore,
  VacancyId,
  handleCardMove,
}) {
  const handleOnCardDragEnd = partialRight(handleOnDragEnd, {
    notifyCallback: onCardDragEnd,
  });
  const handleOnColumnDragEnd = partialRight(handleOnDragEnd, {
    notifyCallback: onColumnDragEnd,
  });

  async function handleOnDragEnd(
    { source, destination, subject },
    { notifyCallback }
  ) {
    when(notifyCallback)((callback) => callback(subject, source, destination));
    handleCardMove(source, destination, subject);
  }

  return (
    <BoardContainer
      onCardDragEnd={handleOnCardDragEnd}
      onColumnDragEnd={handleOnColumnDragEnd}
      loadMore={loadMore}
      renderColumnAdder={() => {
        if (!allowAddColumn) return null;
        if (renderColumnAdder) return renderColumnAdder();
        if (!onNewColumnConfirm) return null;
        return (
          <ColumnAdder
            onConfirm={(title) => onNewColumnConfirm({ title, cards: [] })}
          />
        );
      }}
      {...(renderColumnHeader && { renderColumnHeader: renderColumnHeader })}
      renderCard={(_column, card, dragging) => {
        if (renderCard) return renderCard(card, { dragging });
        return (
          <DefaultCard
            dragging={dragging}
            allowRemoveCard={allowRemoveCard}
            onCardRemove={onCardRemove}
            onCardOptionClick={onCardOptionClick}
          >
            {card}
          </DefaultCard>
        );
      }}
      allowRemoveColumn={allowRemoveColumn}
      onColumnRemove={onColumnRemove}
      allowRenameColumn={allowRenameColumn}
      onColumnRename={onColumnRename}
      disableColumnDrag={disableColumnDrag}
      disableCardDrag={disableCardDrag}
      onCardOptionClick={onCardOptionClick}
      VacancyId={VacancyId}
    >
      {board}
    </BoardContainer>
  );
}

function BoardContainer({
  children: board,
  renderCard,
  disableColumnDrag,
  disableCardDrag,
  renderColumnHeader,
  renderColumnAdder,
  allowRemoveColumn,
  onColumnRemove,
  allowRenameColumn,
  onColumnRename,
  onColumnDragEnd,
  onCardDragEnd,
  onCardNew,
  allowAddCard,
  loadMore,
  onCardOptionClick,
  VacancyId,
}) {
  function handleOnDragEnd(event) {
    const coordinates = getCoordinates(event, board);
    if (!coordinates.source) return;

    isAColumnMove(event.type)
      ? isMovingAColumnToAnotherPosition(coordinates) &&
        onColumnDragEnd({
          ...coordinates,
          subject: board.columns[coordinates.source.fromPosition],
        })
      : isMovingACardToAnotherPosition(coordinates) &&
        onCardDragEnd({
          ...coordinates,
          subject: getCard(board, coordinates.source),
        });
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div
        style={{
          overflowY: "hidden",
          display: "flex",
          alignItems: "flex-start",
          height: "100%",
        }}
        className="react-kanban-board"
      >
        <DroppableBoard
          droppableId="board-droppable"
          direction="horizontal"
          type="BOARD"
        >
          {board.columns.map((column, index) => {
            return (
              <Column
                title={column.title}
                key={column.id}
                columnId={column.id}
                index={index}
                renderCard={renderCard}
                renderColumnHeader={(column) =>
                  renderColumnHeader ? (
                    renderColumnHeader(column)
                  ) : (
                    <DefaultColumnHeader
                      allowRemoveColumn={allowRemoveColumn}
                      onColumnRemove={onColumnRemove}
                      allowRenameColumn={allowRenameColumn}
                      onColumnRename={onColumnRename}
                    >
                      {column}
                    </DefaultColumnHeader>
                  )
                }
                disableColumnDrag={disableColumnDrag}
                disableCardDrag={disableCardDrag}
                onCardNew={onCardNew}
                allowAddCard={allowAddCard}
                loadMore={() => loadMore(column.id)}
                onCardOptionClick={onCardOptionClick}
                VacancyId={VacancyId}
              >
                {column}
              </Column>
            );
          })}
        </DroppableBoard>
        {renderColumnAdder()}
      </div>
    </DragDropContext>
  );
}

export default Board;
