import { useState, ChangeEvent, useCallback, useMemo } from 'react';
import { AppPage } from "../../components/Page/Page.component"
import { JsonPointerInput } from '../../components/JsonPointerInput/JsonPointerInput.component';
import { v4 as uuidv4 } from 'uuid';
import './Playground.page.css';
import { getByPointer, setByPointer } from 'json-pointer-relational';

export const Playground = () => {
    const [pointers, setPointers] = useState<Record<string, string>>({
        'main': ''
    });
    const [jsonDoc, setJsonDoc] = useState<string>('');
    const [jsonDocError, setJsonDocError] = useState<string>('');
    const [setValue, setSetValue] = useState<string>('');
    const [result, setResult] = useState<any>(null);

    const parsedDoc = useMemo(() => {
        let parsedJsonDoc: Record<string, any> | null = null;
        try {
            parsedJsonDoc = JSON.parse(jsonDoc);
            setJsonDocError('');
        } catch(e) {
            parsedJsonDoc = null;
            setJsonDocError('JSON Document provided is not valid');
            return;
        }
        return parsedJsonDoc;
    }, [jsonDoc]);

    const processResults = useCallback(() => {
        if (!parsedDoc) {
            return;
        }
        const pointersArr = Object.values(pointers);
        try {
            let localResult = getByPointer(pointersArr, parsedDoc!);
            if (localResult && typeof localResult === 'object') {
                setResult(JSON.stringify(localResult));
            } else {
                setResult(String(localResult));
            }
        } catch(e: unknown) {
            setResult(`Error: ${String(e)}`);
        }
    }, [jsonDoc, pointers]);

    const setValueByPointer = useCallback(() => {
        if (!parsedDoc) {
            return;
        }
        const pointersArr = Object.values(pointers);
        try {
            let localResult = setByPointer(setValue, pointersArr, parsedDoc!);
            if (localResult && typeof localResult === 'object') {
                setResult(JSON.stringify(localResult));
            } else {
                setResult(String(localResult));
            }
        } catch(e: unknown) {
            setResult(`Error: ${String(e)}`);
        }
    }, [setValue, jsonDoc, pointers]);

    return (
        <AppPage>
            <div className='app-playground-section' >
                <div className='app-playground-section-title' >JSON Document</div>
                <div className='app-playground-section-content' >
                    <textarea 
                        className='app-playground-object-input' 
                        value={jsonDoc} 
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJsonDoc(e.target?.value || '')} 
                    ></textarea>
                </div>
                {
                    jsonDocError ? (
                        <div className='app-playground-section-error' >
                            {jsonDocError}
                        </div>
                    ) : null
                }
            </div>
            <div className='app-playground-section' >
                <div className='app-playground-section-title' >JSON Pointers</div>
                <div className='app-playground-section-content' >
                    {
                        Object.entries(pointers).map(([ key, pointer ]) => (
                            <JsonPointerInput
                                key={key}
                                value={pointer}
                                onChange={value => setPointers({
                                    ...pointers,
                                    [key]: value
                                })}
                                onRemove={() => {
                                    const pointersCopy = {...pointers};
                                    delete pointersCopy[key];
                                    setPointers(pointersCopy);
                                }}
                                disableRemove={key === 'main'}
                            />
                        ))
                    }
                </div>
                <div className='app-playground-section-footer' >
                    <button className='app-playground-section-footer-btn' onClick={() => setPointers({
                        ...pointers,
                        [uuidv4()]: ''
                    })}>Add Pointer</button>
                </div>
            </div>
            <div className='app-playground-section' >
                <button className='app-playground-results-btn' onClick={() => processResults()} >Get Results</button>
            </div>
            <div className='app-playground-section' >
                <div className='app-playground-section-title' >Results</div>
                <div className='app-playground-section-content' >
                    { result }
                </div>
            </div>
            <div className='app-playground-section' >
                <div className='app-playground-section-title' >Set</div>
                <div className='app-playground-section-content' >
                    <div className='app-playground-input-wrapper' >
                        <input 
                            className='app-playground-input' 
                            value={setValue} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSetValue(e.target?.value || '')} 
                        />
                    </div>
                    <button className='app-playground-set-btn' onClick={() => setValueByPointer()} >Set Value</button>
                </div>
            </div>
        </AppPage>
    )
}