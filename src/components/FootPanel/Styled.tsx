import styled from "styled-components";

export const H2 = styled.h2`
    font: caption;
    font-size: 14px;

    cursor: default;
`;

export const KBD = styled.kbd`
    background: #00aced;
    border-radius: 2px;
    color: black;
    font: caption;
    cursor: default;
    width: 26px;
    height: 25px;
    display: flex;

    & span {
        margin: auto;
    }
`;

export const FlexSpaceCenter = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 10px;
    min-width: ${({ minWidth }) => minWidth || "170px"};
    margin: 0 10px 15px 0;
`;

export const FlexContainer = styled.div`
    display: inline-flex;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: scroll;
    flex-wrap: wrap;
    height: 80px;
`;

export const KText = styled.div`
    color: #aaa;
    font: caption;
    font-size: 12px;
    margin-left: 10px;
    cursor: default;
`;

export const ToolIcon = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    overflow: hidden;

    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    cursor: default;

    & * {
        margin: auto;
    }
`;

export const SectionTitle = styled.h2`
    font: caption;
    font-size: 12px;
    font-weight: bold;
    color: #eee;

    padding-bottom: 8px;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    display: inline-block;

    cursor: default;
`;

export const Text = styled.div`
    font: caption;
    color: white;
    font-size: 14px;

    margin: auto auto 20px auto;

    cursor: default;
`;

export const Label = styled.div`
    font: caption;
    font-size: 14px;
    color: #999;

    margin: auto;

    cursor: default;
`;

export const Link = styled.button`
    font: caption;
    font-size: 14px;

    cursor: pointer;

    background: transparent;
    color: #00aced;
    text-decoration: underline;
    border: none;
    outline: none;
`;
