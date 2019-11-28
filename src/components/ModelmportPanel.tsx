import * as React from "react";
import AppContext from "../context";
import { Button, SectionTitle, Select, Label } from "figma-styled-components";
import FileInput from "./FileInput";

export default function ModelImportPanel(props) {
    const { state, dispatch }: any = React.useContext(AppContext);

    const [objBLOB, setOBJ] = React.useState<FileList>(null);
    const [mtlBLOB, setMTL] = React.useState<FileList>(null);
    const [glbBLOB, setGLB] = React.useState<FileList>(null);
    const [fbxBLOB, setFBX] = React.useState<FileList>(null);
    const [binBLOB, setBIN] = React.useState<FileList>(null);
    const [texturesBLOB, setTextures] = React.useState<FileList>(null);

    const [canLoad, setCanNotLoad] = React.useState(true);

    React.useEffect(() => {
        handleCanLoad();
    });

    const importOptions = [
        {
            label: "group 1",
            group: [
                { label: "OBJ", value: "obj" },
                { label: "OBJ + MTL + Textures", value: "obj_mtl" }
            ]
        },
        {
            label: "group 2",
            group: [{ label: "FBX", value: "fbx" }, { label: "FBX + Textures", value: "fbx_tex" }]
        },
        {
            label: "group 3",
            group: [{ label: "GLB / GLTF + BIN + Textures", value: "glb_tex" }]
        }
    ];

    const handleModelSelect = imprtType => {
        dispatch({ type: "SET_IMPORT_TYPE", payload: imprtType });
        handleReset();
    };

    const objFields = () => {
        return (
            <div>
                <Label>OBJ File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setOBJ(event.target.files);
                    }}
                    accept={".obj"}
                    placeholder="Please select OBJ file"
                />
            </div>
        );
    };

    const obj_mtl_tex_Fields = () => {
        return (
            <div>
                <Label>OBJ File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setOBJ(event.target.files);
                    }}
                    accept={".obj"}
                    placeholder="Please select OBJ file"
                />
                <Label>MTL File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setMTL(event.target.files);
                    }}
                    accept={".mtl"}
                    placeholder="Please select MLT file"
                />
                <Label>Textures</Label>{" "}
                <FileInput
                    onChange={event => {
                        setTextures(event.target.files);
                    }}
                    multiple={true}
                    accept={".png, .jpg, .gif, .mat, .tga, .jpeg"}
                    placeholder="Please select Textures (PNGS, TGAS, JPG...)"
                />
            </div>
        );
    };

    const fbxFields = () => {
        return (
            <div>
                <Label>FBX File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setFBX(event.target.files);
                    }}
                    accept={".fbx"}
                    placeholder="Please select FBX file"
                />
            </div>
        );
    };

    const fbx_tex_Fields = () => {
        return (
            <div>
                <Label>FBX File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setFBX(event.target.files);
                    }}
                    accept={".fbx"}
                    placeholder="Please select FBX file"
                />
                <Label>Textures</Label>{" "}
                <FileInput
                    onChange={event => {
                        setTextures(event.target.files);
                    }}
                    multiple={true}
                    accept={".png, .jpg, .gif, .mat, .tga, .jpeg"}
                    placeholder="Please select Textures (PNGS, TGAS, JPG...)"
                />
            </div>
        );
    };

    const glb_tex_Fields = () => {
        return (
            <div>
                <Label>GLB/GLTF File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setGLB(event.target.files);
                    }}
                    accept={".glb, .gltf"}
                    placeholder="Please select GLB/GLTF file"
                />
                <Label>BIN File</Label>{" "}
                <FileInput
                    onChange={event => {
                        setBIN(event.target.files);
                    }}
                    accept={".bin"}
                    placeholder="Please select BIN file"
                />
                <Label>Textures</Label>{" "}
                <FileInput
                    onChange={event => {
                        setTextures(event.target.files);
                    }}
                    multiple={true}
                    accept={".png, .jpg, .gif, .mat, .tga, .jpeg"}
                    placeholder="Please select Textures (PNGS, TGAS, JPG...)"
                />
            </div>
        );
    };

    const handleReset = () => {
        setOBJ(null);
        setMTL(null);
        setGLB(null);
        setFBX(null);
        setBIN(null);
        setTextures(null);
        setCanNotLoad(true);
    };

    const handleCanLoad = () => {
        if (state.importType == "obj" && objBLOB != null) {
            setCanNotLoad(false);
            return;
        }

        if (state.importType == "obj_mtl" && objBLOB != null && mtlBLOB != null) {
            setCanNotLoad(false);
            return;
        }

        if (state.importType == "fbx" && fbxBLOB != null) {
            setCanNotLoad(false);
            return;
        }

        if (state.importType == "fbx_tex" && fbxBLOB != null && texturesBLOB != null) {
            setCanNotLoad(false);
            return;
        }

        if (state.importType == "glb_tex" && glbBLOB != null && binBLOB != null) {
            setCanNotLoad(false);
            return;
        }

        setCanNotLoad(true);
    };

    const handleLoadModel = () => {
        const _export = {
            obj: objBLOB,
            mtl: mtlBLOB,
            fbx: fbxBLOB,
            bin: binBLOB,
            glb: glbBLOB,
            textures: texturesBLOB
        };

        dispatch({ type: "SET_IMPORT_DATA", payload: _export });
    };

    return (
        <div className="panel">
            {/* section2 */}
            <div className="ui-section">
                <div className="pad">
                    <SectionTitle>Model Type</SectionTitle>
                    <div className="layer-options">
                        <Select onChange={handleModelSelect} options={importOptions} />
                    </div>
                    {state.importType == "obj" && objFields()}
                    {state.importType == "obj_mtl" && obj_mtl_tex_Fields()}
                    {state.importType == "fbx" && fbxFields()}
                    {state.importType == "fbx_tex" && fbx_tex_Fields()}
                    {state.importType == "glb_tex" && glb_tex_Fields()}
                </div>
            </div>

            {/* foot buttons */}
            <div className="divider divider--foot"></div>
            <div className="pad">
                <Button
                    fullWidth="true"
                    onClick={handleLoadModel}
                    disabled={canLoad}
                    className="panel__button panel__button--left">
                    Import
                </Button>
            </div>
        </div>
    );
}
