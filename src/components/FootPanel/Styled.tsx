import styled from "styled-components";

export const H2 = styled.h2`
    font: caption;
    font-size: 14px;
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
    margin: 10px;
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

    & * {
        margin: auto;
    }
`;
