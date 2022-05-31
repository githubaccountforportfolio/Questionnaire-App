import { useState, useRef } from "react";
import questionnaire from "../questionnaire.json";

export default function QuestionnaireApp() {
    const name = Object.values(questionnaire)[0].name;
    const list = Object.values(questionnaire)[0].questions;
    const [index, setindex] = useState(0);
    const [mandatoryWarning,setMandatoryWarning] = useState(false);
    const [answer,setAnswer] = useState({})
    const [scroll, setScroll] = useState();
    const inputRef = useRef();

    const moveToNextQue = (dir) => {
        let moveTo = dir ? index + 1 : index - 1;
        if (dir && list[index].required && answer[index] === undefined) {
            setMandatoryWarning(true);
            if (list[index].question_type==="text") {inputRef.current.focus()}
        }
        else {
            dir ? setScroll(1) : setScroll(-1);
            setindex(moveTo);
        }
    }

    const handleKeypress = e => {
        if (e.key === "Enter" && !e.shiftKey && index<list.length-1 && !mandatoryWarning) {
            moveToNextQue(1);
        }
    }

    const checkRadioBtnSelection = (multiple, index, opIndex) => {
        if (answer[index]) {
            if (multiple) {
                if (answer[index].indexOf(opIndex) > -1) {                    
                    return true
                }                
            }
            else {
                if (answer[index] === opIndex) {
                    return true
                }
            }
        }
        return false        
    }

    const handleRadioButtonInput = (multiple, index, selection) => {
        if (mandatoryWarning) {setMandatoryWarning(false)}
        if (multiple) {
            let ans = answer[index] ? [...answer[index], selection] : [selection]
            setAnswer({...answer,[index]:ans})
        }
        else {
            setAnswer({...answer,[index]:selection})
        } 
    }

    const createInputElement = (multiline) =>{
        const InputTag = multiline ? "textarea" : "input";        
        return (
            <div className="options-input">
                <InputTag data-key={index} type = "text" ref={inputRef}
                    placeholder="Enter your answer here" value={answer[index]?answer[index]:""} autoFocus
                    onChange = {(e) => {
                        setAnswer({...answer,[index]:e.target.value});
                        if (mandatoryWarning) {setMandatoryWarning(false)}
                    }}
                    onKeyPress = {handleKeypress}
                    >
                </InputTag>
                {multiline && <div className="textarea-tooltip">Press <strong>Shift</strong>+<strong>Enter</strong> for line break</div>}
            </div>
        )
    }

    const createOptionList = (index) => {
        let multiple = list[index].multiple === "true";
        let inputType = multiple ? "checkbox" : "radio";
        let optionList = list[index].choices;
        return (
            optionList.map((op, opIndex) => { return (
                <label key={index + op.label} className={"options-label label-"+inputType}>
                    {op.value}
                    <input className="options-selection" type={inputType} value={op.value} data-testid={"options-selection"}
                        defaultChecked={checkRadioBtnSelection(multiple, index, opIndex)}
                        name={multiple ? op.value : "singleOption"}
                        onChange={() => {handleRadioButtonInput(multiple, index, opIndex)}}
                        onKeyPress={handleKeypress}
                    />
                    <span className="checkmark"></span>
                </label>
            )})
        )
    }

    return (
        <div className="parent-container">
            <div data-testid="header" className="header">{name}</div> 
            <div className={"question-card"+(scroll === 1 ? " scrollNext" : (scroll === -1 ? ' scrollPrev' : " "))}
                onAnimationEnd={()=>{setScroll(0)}}>
                <div className="question-number">Q{index+1}. </div>
                <div className="question-card-inner-container">
                    <div className="question-section">
                        <div> {list[index].headline}{list[index].required?" *":""}</div>
                        <div className={"mandatory-field-warning"+(mandatoryWarning?"":" hide-item")}>Mandatory field, please provide an input</div>
                    </div>
                    <div className="options-section">
                        {list[index].question_type ==="text" ? 
                        createInputElement(list[index].multiline === "true") :
                        createOptionList(index)}
                    </div>
                </div>
            </div>          
            <div className="button-container">
                <button className={index===0?"hide-item":""}
                    onClick={() => {moveToNextQue(false)}}>Previous</button>
                <button className={"next-button"+(index===list.length-1?" hide-item":"")}
                    onClick={() => {moveToNextQue(true)}}
                    onKeyPress={handleKeypress}
                    >
                        Next
                </button>
                <div className={"nextbutton-tooltip"+(index===list.length-1?" hide-item":"")}>Press <strong>Enter ↵</strong></div>
            </div>

        </div>
    )
}
 