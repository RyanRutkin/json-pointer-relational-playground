import { useState, ChangeEvent, useCallback } from 'react';
import { AppPage } from "../../components/Page/Page.component"
import { JsonPointerInput } from '../../components/JsonPointerInput/JsonPointerInput.component';
import { getByPointer } from '../../json-pointer-relative';
import { v4 as uuidv4 } from 'uuid';
import './Playground.page.css';

export const Playground = () => {
    const [pointers, setPointers] = useState<Record<string, string>>({
        'main': ''
    });
    const [jsonDoc, setJsonDoc] = useState<string>('');
    const [jsonDocError, setJsonDocError] = useState<string>('');
    const [result, setResult] = useState<any>(null);

    const processResults = useCallback(() => {
        let parsedJsonDoc: Record<string, any> | null = null;
        try {
            parsedJsonDoc = JSON.parse(jsonDoc);
        } catch(e) {
            setJsonDocError('JSON Document provided is not valid');
            return;
        }
        const pointersArr = Object.values(pointers);
        try {
            let localResult = getByPointer(pointersArr, parsedJsonDoc!);
            if (localResult && typeof localResult === 'object') {
                setResult(JSON.stringify(localResult));
            } else {
                setResult(String(localResult));
            }
        } catch(e: unknown) {
            setResult(`Error: ${String(e)}`);
        }
    }, [jsonDoc, pointers]);

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
        </AppPage>
    )
}