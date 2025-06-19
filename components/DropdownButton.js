import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false
library.add(fas, fab)

function DropdownButton({
  icon = null,
  text = 'Show menu',
  choices = [],
  onSelect = () => {},
  style = {},
  menuStyle = {},
  children
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const btnRef = useRef(null)
  useEffect(() => {
    function handleOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside)
    }
  }, [open])

  const toggleMenu = event => {
    event.preventDefault()
    setOpen(prev => !prev)
  }

  const handleChoice = key => {
    setOpen(false)
    onSelect(key)
  }

  return (
    <div className='dropdownContainer'>
      <button
        ref={btnRef}
        className={children ? undefined : 'btn'}
        onClick={toggleMenu}
        style={style}
        type='button'
      >
        {children ? (
          children
        ) : (
          <>
            {icon && (
              <span className='btnIcon'>
                <FontAwesomeIcon icon={icon} />
              </span>
            )}
            {text}
          </>
        )}
      </button>

      {open && (
        <ul className='menu' ref={menuRef} style={menuStyle}>
          {choices.map(choice => (
            <li key={choice.key} className='choiceItem'>
              <button
                className='choice'
                type='button'
                onClick={() => handleChoice(choice.key)}
              >
                {choice.icon && (
                  <span className='btnIcon'>
                    <FontAwesomeIcon icon={choice.icon} />
                  </span>
                )}
                {choice.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .dropdownContainer {
          display: inline-block;
          vertical-align: middle;
          position: relative;
        }
        .btn {
          font-family: 'Open Sans', sans-serif;
          background: #7bc043;
          text-decoration: none;
          text-transform: uppercase;
          color: white;
          font-size: 14px;
          border-radius: 4px;
          border: none;
          display: inline-block;
          padding: 16px;
          padding-left: 24px;
          padding-right: 24px;
          outline: none;
          cursor: pointer;
        }
        .btnIcon {
          margin-right: 16px;
          display: inline;
        }
        .menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          padding: 0;
          margin: 0;
          list-style: none;
          z-index: 2;
          background: white;
          box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
          min-width: 100%;
        }
        .choiceItem:not(:last-child) .choice {
          border-bottom: 1px solid #efefef;
        }
        .choice {
          font-family: 'Open Sans', sans-serif;
          background: white;
          text-decoration: none;
          text-transform: uppercase;
          color: #333;
          min-width: 200px;
          font-size: 14px;
          border: none;
          display: flex;
          padding: 16px;
          padding-left: 24px;
          padding-right: 24px;
          text-align: left;
          outline: none;
          cursor: pointer;
          flex-direction: row;
        }
        .choice:hover {
          background: #fafafa;
        }
        .choice:last-child {
          border-bottom: 0px;
        }
      `}</style>
    </div>
  )
}

export default DropdownButton
