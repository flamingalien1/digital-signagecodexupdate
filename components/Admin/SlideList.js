import { Component } from 'react'
import React from 'react'
import ContentLoader from 'react-content-loader'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import arrayMove from 'array-move'

import SlideCard from './SlideCard'

import { getSlides } from '../../actions/slide'
import { reorderSlides } from '../../actions/slideshow'

class SlideList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      slides: null
    }
  }

  componentDidMount() {
    const { slideshow } = this.props
    getSlides(slideshow).then(slides => {
      this.setState({
        slides: slides
      })
    })
  }

  onDragEnd = result => {
    if (!result.destination) return
    const { slideshow } = this.props
    const { index: oldIndex } = result.source
    const { index: newIndex } = result.destination
    this.setState(
      {
        slides: arrayMove(this.state.slides, oldIndex, newIndex)
      },
      () => {
        reorderSlides(slideshow, oldIndex, newIndex)
      }
    )
  }

  refresh = () => {
    const { slideshow } = this.props
    return getSlides(slideshow).then(slides => {
      return this.setState({
        slides: slides
      })
    })
  }

  render() {
    const { slides } = this.state
    return slides ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId='slides'>
          {provided => (
            <div className={'list'} ref={provided.innerRef} {...provided.droppableProps}>
              <div className={'timeline'} />
              {slides.map((value, index) => (
                <Draggable key={value._id} draggableId={value._id} index={index}>
                  {provided2 => (
                    <div
                      ref={provided2.innerRef}
                      {...provided2.draggableProps}
                      {...provided2.dragHandleProps}
                    >
                      <SlideCard index={index} value={value} refresh={this.refresh} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <style jsx>{`
                .list {
                  position: relative;
                }
                .timeline {
                  width: 4px;
                  height: calc(100% - 20px);
                  border-radius: 2px;
                  position: absolute;
                  left: 50%;
                  top: 10px;
                  margin-left: -2px;
                  background: #cccccc;
                  z-index: 0;
                }
              `}</style>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      Array(4)
        .fill()
        .map((i, index) => (
          <ContentLoader height={120} width={640} key={`loading-${index}`}>
            <rect x='0' y='0' rx='5' ry='5' width='100%' height='100' />
          </ContentLoader>
        ))
    )
  }
}

export default SlideList
