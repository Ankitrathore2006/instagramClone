import React from 'react'

export default function Story(props) {
  return (
    <li>
    <a href="#">
        <div className="s">
            <div className="s-im">
                <div>
                    <img src={props.photo} alt=""/>
                </div>
            </div>
            <div className="s-name">
                    <p>{props.name}</p>
            </div>
        </div>
    </a>
    </li>
  )
}
