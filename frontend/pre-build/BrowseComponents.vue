<template>


    <section style="display: flex; flex-flow: column; min-height: 100vh; background-color: rgb(245, 245, 245);" v-load-foundation>


        <section style="flex: 1;" class="off-canvas-wrapper">

            <Browse-Header :reveal-for-medium="revealForMedium" :header-style="{'margin-left': isMobile ? '0px' : '300px', 'background-color': '#3C4A52'}"></Browse-Header>

            <div class="off-canvas position-left reveal-for-medium" style="width: 300px; padding-top: 100px;" id="offCanvasLeft1" data-transition="overlap" data-off-canvas>

                <!-- Your menu or Off-canvas content goes here -->

                <ul>
                    <Tree-Item
                        class="item"
                        :model="treeData"
                        :onclick="showComponent"
                        menu_toggle="offCanvasLeft1">
                    </Tree-Item>
                </ul>

            </div>
            <div class="off-canvas-content" data-off-canvas-content :style="{'margin-left': isMobile ? '0px' : '300px'}">

                <div class="row" style="margin: 2rem;">
                    <h4>{{currentComponent}}</h4>
                </div>

                <div class="row" style="margin: 2rem; background-color: white; padding: 2rem;">
                    <div class="column">

                        <wrapper-component :tag="currentComponent"></wrapper-component>

                    </div>
                </div>

            </div>


        </section>




    </section>



</template>


<style lang="scss">

    .item {
        color: white;
        list-style-type: none;
    }
    div.leaf {
        color: green;
    }

    // test
    $sidenavwidth: 90vw;

    .off-canvas {
        background-color: #3C4A52;
    }

    .position-left {
        width: $sidenavwidth;
        // height: 100%;
        transform: translateX(-$sidenavwidth);
    }

    .position-right  {
        width: $sidenavwidth;
        // height: 100%;
        transform: translateX($sidenavwidth);
    }

    @media print, screen and (min-width: 40em) {
        .position-left {
            width: 200px;
        }
        .position-right {
            width: 35%;
            min-width: 200px;
        }
        .position-left.reveal-for-medium ~ .off-canvas-content {
            margin-left: 200px;
        }
        .position-right.reveal-for-medium ~ .off-canvas-content {
            // width: 35vw;
            margin-right: 35%;
        }
    }

    .off-canvas.is-transition-overlap.is-open {
        box-shadow: 0 0 2px rgba(10, 10, 10, 0.3) !important;
    }

</style>


<script type="text/babel">

    //
    // LIBRARIES
    //

    import _ from 'lodash';

    import Vue from 'vue';


    for (let path of paths) {
        if (!componentMap[path])
            console.log("The following component is missing a name: ", path)
    }


    //
    // EXPORT
    //

    Vue.component('wrapper-component', {
        name: 'wrapper-component',
        render(createElement) {
            return createElement(
                this.tag,   // tag name
                this.$slots.default // array of children
            );
        },

        props: {
            tag: {
                type: String,
                required: true,
            },
        },
        components
    });


    export default {
        name: "BrowseComponents",

        data () {
            return {
                paths,
                componentMap,
                currentComponent: 'div',
                isMobile: window.innerWidth <= 640
            }
        },

        mounted: function () {
            window.onresize = function(event) {
                this.isMobile = window.innerWidth <= 640;
            }.bind(this);
        },

        methods: {
            buildTree: function (folders, path = '') {
                let aux = {};

                for (let folder in folders) {
                    // always only one folder
                    if (folder != '/' && path)
                        path = path + '/' + folder;
                    else if (folder != '/')
                        path = folder;
                    aux.name = folder;
                    aux.children = [];
                    for (let key in folders[folder]) {
                        if (key != '_files' && key != '__proto__' && key != 'length') {
                            let subtree = _.cloneDeep(this.buildTree({[key]: folders[folder][key]}, path));
                            aux.children.push(subtree)
                        }
                    }
                    if (folders[folder]._files) {
                        let files = _.map(folders[folder]._files, (o) => {return {'name': o, 'path': path}});
                        aux.children = _.concat(aux.children, files);
                    }
                }
                return aux;
            },
            showComponent: function (file) {
                if (this.componentMap[file])
                    this.currentComponent = this.componentMap[file];
                else
                    this.currentComponent = "div";
            }
        },

        computed: {
            callout_id: function () {
                if (!this.id)
                    return "CID_PAGE";
                else
                    return "CID_" + this.id;
            },
            folders: function () {
                let aux = {'/': {'_files': []}};
                for (let folder of this.paths) {
                    folder = folder.split('/');
                    for (let i = 0; i < folder.length; i++) {
                        let currentFolder = folder.slice(0, i).join('.');
                        let evalString;
                        if (currentFolder)
                            evalString = `aux['/'].${currentFolder}`;
                        else {
                            evalString = "aux['/']";
                        }
                        if (!eval(evalString)) {
                            eval(`${evalString} = {'_files': []}`);
                        }
                        if (i == folder.length - 1) {
                            eval(`${evalString}._files.push('${folder[i]}')`);
                        }
                    }
                }
                return aux;
            },
            treeData: function () {
                return this.buildTree(this.folders);
            }
        },

        props: {
            id: {
                default: "PAGE"
            },
            revealForMedium: {
                default: true
            }
        },

        components: components
    }

</script>


