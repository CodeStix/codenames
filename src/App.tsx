import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function CodeNames(props: { possibleFiles: string[] }) {
    const [files, setFiles] = useState(props.possibleFiles);

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
        shuffle();
    }, []);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 200px)", gridTemplateRows: "repeat(4, 200px)", gap: "30px" }}>
            {new Array(16).fill(0).map((_, i) => (
                <div key={i} style={{ background: "#222", borderRadius: "1rem", overflow: "hidden", display: "relative" }}>
                    <div
                        style={{
                            backgroundImage: `url("${"/images/" + files[i]}")`,
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            height: "100%",
                        }}></div>
                </div>
            ))}
        </div>
    );
}

function App() {
    const [possibleFiles, setPossibleFiles] = useState<string[]>();

    async function refreshPossbileFiles() {
        const res = await fetch("/images/files.json");
        return (await res.json()).files as string[];
    }

    useEffect(() => {
        refreshPossbileFiles().then((e) => setPossibleFiles(e));
    }, []);

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            {/* <h2>codenames</h2> */}
            {possibleFiles ? <CodeNames possibleFiles={possibleFiles} /> : <p>loading</p>}
        </div>
    );
}

export default App;
