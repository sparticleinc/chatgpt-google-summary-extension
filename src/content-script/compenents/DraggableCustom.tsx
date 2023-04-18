import Draggable from '@camdarragh/react-draggable'

function DraggableCustom(props) {
  const [isDrag, setIsDrag] = useState<boolean>(false)

  return (
    <>
      <Draggable
        axis="y"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsDrag(true)
        }}
        onStart={(e) => {
          e.preventDefault()
          setIsDrag(true)
        }}
        onStop={(e) => {
          setIsDrag(false)
          const { target, type } = e

          if (target && type === 'touchend') {
            try {
              target.click()
            } catch (error) {
              console.error(error)
            }
          }
          return true
        }}
        onDrag={(e) => {
          e.preventDefault()
          setIsDrag(true)
        }}
        cancel={'[class*="glarity--nodrag"]'}
      >
        {props?.children}
      </Draggable>
    </>
  )
}

export default DraggableCustom
