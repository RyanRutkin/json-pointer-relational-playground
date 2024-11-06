import { ChangeEvent, FC } from "react";
import './JsonPointerInput.component.css';

export const JsonPointerInput: FC<{
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    disableRemove?: boolean
}> = ({ value, onChange, onRemove, disableRemove }) => {
    return (
        <div className="app-json-pointer-input" >
            <div className="app-json-pointer-input-wrapper" >
                <input className="app-json-pointer-input-element" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target?.value || '')}/>
            </div>
            <button
                className="app-json-pointer-input-remove-btn"
                value={value}
                onClick={() => onRemove()}
                disabled={disableRemove}
            >X</button>
        </div>
    )
}
