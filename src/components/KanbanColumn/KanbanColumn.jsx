import { Draggable, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../TaskCard/TaskCard';

function KanbanColumn({ columnId, title, tasks, onTaskClick }) {
  return (
    <div className="col-md-3">
      <div className="kanban-column bg-white border rounded p-2">
        <h6 className="px-2 pt-2">{title} ({tasks.length})</h6>
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={`p-2 min-height-300 rounded ${snapshot.isDraggingOver ? 'bg-light' : ''}`}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                  {(dragProvided) => (
                    <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                      <TaskCard task={task} onClick={onTaskClick} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export default KanbanColumn;
