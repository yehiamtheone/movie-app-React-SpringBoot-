import { Form, Button } from "react-bootstrap"
const ReviewForm = ({handleSubmit, refText, labelText}) => {
  const reviewOnPress = (event)=>{
    
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
      
    }
  }
  return (
    <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>{labelText}</Form.Label>
            <Form.Control onKeyDown={reviewOnPress} ref={refText} as={"textarea"} rows={3} 
            placeholder={`Enter to submit${"\n"}shift+enter to go down a line`} />
        </Form.Group>
        <Button  variant="outline-info" onClick={handleSubmit}>Submit</Button>
    </Form>
    
  )
}

export default ReviewForm;