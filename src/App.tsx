import { useEffect, useState } from "react";

const WIDTH = 4;
const HEIGHT = 4;
const SQUARE_SIZE = "200px";

const COLORS_PER_TYPE: Record<string, string> = {
    MURDERER: "#555555",
    PEDESTRIAN: "#ddffdd",
    TEAM_0: "#2255ff",
    TEAM_1: "#ff2222",
    TEAM_2: "#33bb33",
    TEAM_3: "#cccc33",
};

function CodeNames(props: { field: FieldInfo; turnedAllAround: boolean; showBorder?: boolean }) {
    const [shown, setShown] = useState<boolean[]>(() => new Array(WIDTH * HEIGHT).fill(false));

    useEffect(() => {
        setShown(new Array(WIDTH * HEIGHT).fill(props.turnedAllAround));
    }, [props.turnedAllAround]);

    return (
        <div
            className="codenames-grid"
            style={{
                border: props.showBorder ? `3px dotted ${COLORS_PER_TYPE[props.field.startingTeam]}` : undefined,
                borderRadius: "1rem",
                padding: "20px",
                display: "grid",
                gridTemplateColumns: `repeat(${WIDTH}, ${SQUARE_SIZE})`,
                gridTemplateRows: `repeat(${HEIGHT}, ${SQUARE_SIZE})`,
                gap: "20px",
            }}>
            {new Array(WIDTH * HEIGHT).fill(0).map((_, i) => (
                <div key={i} style={{}}>
                    <div
                        onClick={() => {
                            let newShown = [...shown];
                            newShown[i] = props.turnedAllAround || !newShown[i];
                            setShown(newShown);
                        }}
                        style={{
                            background: "#222",
                            borderRadius: "5px",
                            position: "relative",
                            height: "100%",
                        }}>
                        {!props.turnedAllAround && (
                            <div
                                style={{
                                    borderRadius: "5px",
                                    overflow: "hidden",
                                    backgroundImage: `url("${"/images/" + props.field.images[i]}")`,
                                    backgroundPosition: "center center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    height: "100%",
                                }}></div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                                borderRadius: "5px",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: COLORS_PER_TYPE[props.field.field[i]],
                                opacity: shown[i] ? 0.9 : 0,
                                transform: shown[i] ? `translate(0, 0)` : `translate(-40px, -100px)`,
                                transition: "300ms",
                            }}>
                            {props.field.field[i] === "MURDERER" && <img width="60%" height="auto" src="/user-ninja-solid.svg"></img>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

type FieldInfo = {
    field: string[];
    images: string[];
    startingTeam: string;
};

function App() {
    const [field, setField] = useState<FieldInfo>();

    async function getField(): Promise<FieldInfo> {
        const res = await fetch("/field.json");
        return await res.json();
    }

    useEffect(() => {
        getField().then((e) => setField(e));
    }, []);

    if (!field) {
        return <>loading</>;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            <CodeNames field={field} turnedAllAround={window.location.hash === "#secret"} />
        </div>
    );
}

export default App;
