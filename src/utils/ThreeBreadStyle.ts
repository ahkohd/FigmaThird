/**
 * Style object for [react-treebread](https://github.com/storybookjs/react-treebeard#style)
 */
const style = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            color: '#333333',
            fontSize: '12px',
            font: 'caption',
            userSelect: 'none'
        },
        node: {
            base: {
                position: 'relative',
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block',
                color: '#222',
                border: '1px solid transparent'
            },
            activeLink: {
                background: '#D6EBF8',
                border: '1px solid #D6EBF8'
            },
            toggle: {
                base: {
                    transformOrigin: '50% 50%',
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    height: '24px',
                    width: '24px',
                    marginTop: '5px'
                },
                wrapper: {
                    position: 'absolute',
                    margin: 'auto',
                    height: '14px',
                    top: '38%',
                    left: '40%',
                },
                height: 6,
                width: 6,
                arrow: {
                    fill: '#999',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#9DA5AB'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle',
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};

export default style;