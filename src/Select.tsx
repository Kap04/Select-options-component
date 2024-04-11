import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css"
export type SelectOptions = {
    label : string,
    value : string | number
}

type SingleSelectProps = {
    multiple?: false,
    value?: SelectOptions ,
    onChange : (value  : SelectOptions | undefined) => void;

}

type MultipleSelectProps = {
    multiple : true,
    value: SelectOptions[] ,
    onChange : (value  : SelectOptions[]) => void;
}

type SelectProps = {
    options : SelectOptions[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({ multiple , value , onChange , options}:SelectProps) {

    const [isOpen , setIsOpen] = useState(false);
    const [highlightedIndex , setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null)

    function clearOptions(){
        multiple ? onChange([]) : onChange(undefined);
    }
    function selectOption(option : SelectOptions){
        if(multiple){
            if(value.includes(option)){
                onChange(value.filter(o => o !== option))
            }else{
                onChange([...value,option])
            }
        }else{
            if(option !== value) onChange(option)
        }
    }

    // function isOptionsSelected(option : SelectOptions){
    //     return multiple ? value.includes(option) : option.value === value?.value
    // }
    function isOptionsSelected(option: SelectOptions): boolean {
        if (multiple) {
          return value instanceof Array && value.some((v) => v.value === option.value);
        } else {
          return value?.value === option.value;
        }
      }

    useEffect(() => {
        if(isOpen) setHighlightedIndex(0);
    },[isOpen])

    useEffect(()=>{
        const handler = (e:KeyboardEvent) => {
            if(e.target != containerRef.current) return
            switch (e.code){
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if(isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown":
                    if(!isOpen){
                        setIsOpen(true)
                        break
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if(newValue >= 0 && newValue< options.length){
                        setHighlightedIndex(newValue)
                    }
                    break
                case "Escape":
                    setIsOpen(false)
                    break
            }
        }
        containerRef.current?.addEventListener("keydown",handler)

        return() => {
            containerRef.current?.removeEventListener("keydown",handler)
        }
    },[isOpen , highlightedIndex , options])


    return (
        <div ref={containerRef} onClick={() => setIsOpen(prev => !prev)} tabIndex={0} className= {styles.container}>
            <span className={styles.value}>{ multiple ? value.map(v => (
                <button key = {v.value} onClick={e => {
                    e.stopPropagation()
                    selectOption(v)
                }}
                className={styles["option-badge"]}
                >{v.label}
                <span className={styles["remove-btn"]}>&times;</span></button>
            )) :  value?.label}</span>
            <button onClick={(e) =>{
                e.stopPropagation(), 
                clearOptions()}} className= {styles["clear-btn"]} >&times;</button>
            <div className= {styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className= {`${styles.options} ${ isOpen? styles.show : ""}`}>
                {options.map((option , index) => (
                    <li onClick={(e) => {
                        e.stopPropagation()
                        selectOption(option)
                        setIsOpen(false)}
                    }  
                    
                    onMouseEnter={() => setHighlightedIndex(index)}
                    key={option.value} 
                    className= {
                        `${styles.option}
                        ${isOptionsSelected(option) ? styles.selected : ""}
                        ${index === highlightedIndex ? styles.highlighted : ""}
                        `}>

                        {option.label}

                    </li>
                ))}
            </ul>
        </div>
    )
}