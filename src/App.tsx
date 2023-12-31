import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const WIDTH = 4;
const HEIGHT = 4;

const COLORS_PER_TYPE: Record<number, string> = {
    [-1]: "gray",
    [0]: "#ddffdd",
    [1]: "#2255ff",
    [2]: "#ff2222",
};

function CodeNames(props: { possibleFiles: string[]; field: number[]; turnedAllAround: boolean }) {
    const [files, setFiles] = useState(props.possibleFiles);
    const [shown, setShown] = useState<boolean[]>(() => new Array(WIDTH * HEIGHT).fill(false));

    function shuffle() {
        const f = [...files];
        for (let i = 0; i < f.length; i++) {
            let r = Math.floor(Math.random() * f.length);
            let t = f[i];
            f[i] = f[r];
            f[r] = t;
        }
        console.log(f);
        setFiles(f);
    }

    useEffect(() => {
        if (props.turnedAllAround) {
            setShown(new Array(WIDTH * HEIGHT).fill(true));
        }
    }, [props.turnedAllAround]);

    useEffect(() => {
        shuffle();
    }, []);

    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${WIDTH}, 200px)`, gridTemplateRows: `repeat(${HEIGHT}, 200px)`, gap: "30px" }}>
            {new Array(16).fill(0).map((_, i) => (
                <div key={i} style={{}}>
                    <div
                        onClick={() => {
                            let newShown = [...shown];
                            newShown[i] = !newShown[i];
                            setShown(newShown);
                        }}
                        style={{
                            background: "#222",
                            borderRadius: "1rem",
                            position: "relative",
                            height: "100%",
                        }}>
                        {!props.turnedAllAround && (
                            <div
                                style={{
                                    borderRadius: "1rem",
                                    overflow: "hidden",
                                    backgroundImage: `url("${"/images/" + files[i]}")`,
                                    backgroundPosition: "center center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    height: "100%",
                                }}></div>
                        )}
                        <div
                            style={{
                                pointerEvents: "none",
                                borderRadius: "1rem",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: COLORS_PER_TYPE[props.field[i]],
                                opacity: shown[i] ? 0.9 : 0,
                                transform: shown[i] ? `translate(0, 0)` : `translate(-40px, -100px)`,
                                transition: "300ms",
                            }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Table(props: { field: number[] }) {
    const [possibleFiles, setPossibleFiles] = useState<string[]>();

    async function getPossbileFiles() {
        const res = await fetch("/images/files.json");
        return (await res.json()).files as string[];
    }

    useEffect(() => {
        getPossbileFiles().then((e) => setPossibleFiles(e));
    }, []);

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            {possibleFiles ? <CodeNames field={props.field} possibleFiles={possibleFiles} turnedAllAround={false} /> : <p>loading</p>}
        </div>
    );
}

function App() {
    const [field, setField] = useState<number[]>();

    async function getField() {
        const res = await fetch("/field.json");
        return (await res.json()).field as number[];
    }

    useEffect(() => {
        getField().then((e) => setField(e));
    }, []);

    if (!field) {
        return <>loading</>;
    }

    return <Table field={field} />;
}

export default App;
