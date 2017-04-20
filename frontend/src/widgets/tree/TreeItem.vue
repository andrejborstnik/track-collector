<template>
    <li>
        <div
            :class="{bold: isFolder, leaf: !isFolder}"
            @click="click"
            @dblclick="changeType"
            :data-toggle="!isFolder && menu_toggle">
            {{model && model.name}}
            <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <Tree-Item
                class="item"
                v-for="model in (model.children)"
                :model="model"
                :onclick="onclick"
                :menu_toggle="menu_toggle">
            </Tree-Item>
            <!--<li class="add" @click="addChild">+</li>-->
        </ul>
    </li>
</template>

<script type="text/babel">
    export default{
        name: "TreeItem",
        props: {
            model: Object,
            onclick: {
                type: Function,
                default: () => {}
            },
            menu_toggle: {}
        },
        data: function () {
            return {
                open: false
            }
        },
        computed: {
            isFolder: function () {
                return this.model && this.model.children && this.model.children.length;
            }
        },
        methods: {
            toggle: function () {
                 if (this.isFolder) {
                     this.open = !this.open;
                 }
            },
            click: function () {
                this.toggle();
                if (!this.isFolder) {
                    let file;
                    if (this.model && this.model.path)
                        file = this.model.path + '/' + this.model.name;
                    else
                        file = this.model.name;
                    this.onclick(file);
                }
            },
            changeType: function () {
                if (!this.isFolder) {
                    Vue.set(this.model, 'children', []);
                    this.addChild();
                    this.open = true;
                }
            },
            addChild: function () {
                this.model.children.push({
                    name: 'new stuff'
                })
            }
        }
    }
</script>
