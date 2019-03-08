import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { postReorderedURLs } from '../../api-requests/post-reordered-urls';
import TrackVisibility from 'react-on-screen';
import URLCard from '../url-card';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'white',
  boxShadow: `0 0 5px ${
    isDragging ? 'var(--color-blue)' : 'var(--color-orange)'
  }`,
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'var(--background-primary)',
  padding: grid,
  width: 600,
});

const URLList = props => {
  const [urls, setURLs] = useState(props.userURLs);
  // watch urls for change excepting initial render
  const firstUpdate = useRef(true);
  useLayoutEffect(
    () => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }

      postReorderedURLs(urls, props.user._id).then(result =>
        props.setUser(result)
      );
    },
    [urls]
  );

  // watch props.userURLs for change
  useEffect(
    () => {
      if (arraysUnequal(props.userURLs, urls)) {
        setURLs(props.userURLs);
      }
    },
    [props.userURLs]
  );

  const arraysUnequal = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return true;
    for (let i = arr1.length; i--; ) {
      if (arr1[i]._id !== arr2[i]._id) return true;
    }
    return false;
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const reorderedURLs = reorder(
      urls,
      result.source.index,
      result.destination.index
    );

    setURLs(reorderedURLs);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {urls.map((url, index) => (
              <Draggable key={url.hash} draggableId={url.hash} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <TrackVisibility style={{ display: 'flex' }}>
                      <URLCard
                        url={url}
                        user={props.user}
                        setUser={props.setUser}
                      />
                    </TrackVisibility>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default URLList;
