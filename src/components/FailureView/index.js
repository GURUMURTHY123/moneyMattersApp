import React from 'react'

const FailureView = props => {
  const {responseStatus, responseText} = (props.location.state)
  return(
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
      <h1>Service Error: 404 Not Found</h1>
      <p>{responseText}</p>
    </div>
  )
}

export default FailureView