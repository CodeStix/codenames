import { useEffect, useState } from "react";

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
    const [shown, setShown] = useState<boolean[]>(() => new Array(props.field.width * props.field.height).fill(false));
    const [rotation, setRotation] = useState(0);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setShown(new Array(props.field.width * props.field.height).fill(props.turnedAllAround));
    }, [props.turnedAllAround, props.field.width, props.field.height]);

    function toggleShown(i: number) {
        let newShown = [...shown];
        newShown[i] = props.turnedAllAround || !newShown[i];
        setShown(newShown);
    }

    useEffect(() => {
        function onKeyDown(ev: KeyboardEvent) {
            switch (ev.code) {
                case "KeyE": {
                    setRotation((rotation + 90) % 360);
                    break;
                }
                case "KeyQ": {
                    setRotation((rotation - 90) % 360);
                    break;
                }
                case "ArrowRight": {
                    let n = { ...cursor, x: cursor.x + 1 };
                    if (n.x >= props.field.width) {
                        n.x = props.field.width - 1;
                        setRotation(-90);
                    }
                    setCursor(n);
                    break;
                }
                case "ArrowLeft": {
                    let n = { ...cursor, x: cursor.x - 1 };
                    if (n.x < 0) {
                        n.x = 0;
                        setRotation(90);
                    }
                    setCursor(n);
                    break;
                }
                case "ArrowDown": {
                    let n = { ...cursor, y: cursor.y + 1 };
                    if (n.y >= props.field.height) {
                        n.y = props.field.height - 1;
                        setRotation(0);
                    }
                    setCursor(n);
                    break;
                }
                case "ArrowUp": {
                    let n = { ...cursor, y: cursor.y - 1 };
                    if (n.y < 0) {
                        n.y = 0;
                        setRotation(180);
                    }
                    setCursor(n);
                    break;
                }
                case "Space": {
                    toggleShown(cursor.y * props.field.width + cursor.x);
                    break;
                }
                case "KeyW": {
                    setShown(new Array(props.field.width * props.field.height).fill(true));
                    break;
                }
            }

            console.log("key", ev);
        }

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [cursor, rotation, shown]);

    return (
        <div
            className="codenames-grid"
            style={{
                border: props.showBorder ? `3px dotted ${COLORS_PER_TYPE[props.field.startingTeam]}` : undefined,
                borderRadius: "1rem",
                padding: "20px",
                display: "grid",
                gridTemplateColumns: `repeat(${props.field.width}, ${SQUARE_SIZE})`,
                gridTemplateRows: `repeat(${props.field.height}, ${SQUARE_SIZE})`,
                gap: "20px",
            }}>
            {new Array(props.field.width * props.field.height).fill(0).map((_, i) => (
                <div key={i} style={{}}>
                    <div
                        onClick={() => {
                            toggleShown(i);
                        }}
                        style={{
                            background: "#222",
                            borderRadius: "5px",
                            outline:
                                Math.floor(i / props.field.width) === cursor.y && i % props.field.width === cursor.x ? "5px solid white" : undefined,
                            position: "relative",
                            height: "100%",
                            transform: `rotate(${rotation}deg)`,
                            transition: "500ms",
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
                                opacity: shown[i] ? 0.6 : 0,
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
    width: number;
    height: number;
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
