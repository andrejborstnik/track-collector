//
// ACTIVATE MIXIN
//


//
// EXPORT
//


export const activate_mixin = {

    methods: {
        activate: () => {},

        deactivate: () => {},

        m$_id() { return this.$vnode.componentOptions.Ctor.cid; },
        m$_routerChain() { return this.$router.currentRoute.matched.map(o => o.components.default._Ctor[0].cid); },
        m$_lastOnRoute() { return this.$router.currentRoute.matched.slice(-1)[0].components.default._Ctor[0].cid; },

        m$_shouldActivate() {
            // The routing chain for the current route.
            let router_chain = this.m$_routerChain();

            let cache_hit = this.m$_cache[[router_chain, this.m$_id()]];
            if (cache_hit !== undefined) {
                this.m$_log('CheckActivate', cache_hit);
                return cache_hit;
            }

            // Crawl and check if we hit or miss master UID
            // (i.e. this component is the route component's child).
            let current = this;
            while (current && current.$vnode && current.$vnode.componentOptions.Ctor.cid != this.m$_lastOnRoute()) {
                current = current.$parent;
            }
            if (current.$vnode === undefined) current = null;

            this.m$_cache[[router_chain, this.m$_id()]] = !!current;
            this.m$_log('CheckActivate', !!current);

            return !!current;
        },

        m$_log(name, msg) {
            if (this.m$_is_debug) {
                let out = `${name}: [${this.$options.name}] -- (${this.m$_id()} --> ${this.m$_routerChain()})`;
                out += (msg !== undefined) ? `-- ${JSON.stringify(msg)}` : "";
                console.debug(out);
            }
        }
    },

    mounted: function () {
        this.m$_log('Mounted');
        this.activate();
        this.m$_activate.is_activated = true;

        // Get the UID of the component attached to the current route.
        this.m$_cache[[this.m$_routerChain(), this.m$_id()]] = true;
    },

    watch: {
        '$route': function () {
            let should_activate = this.m$_shouldActivate();
            this.m$_log('$route', should_activate);

            // We should deactivate if component is already active.
            // (the same route has been visited more than once in a row).
            if (should_activate && this.m$_activate.is_activated) {
                this.m$_log('DeactivateIfActivated');
                this.deactivate();
                this.m$_activate.is_activated = false;
                this.m$_activate.is_deactivated = true;
            }

            if (should_activate) {
                this.m$_log('Activate');
                this.activate();
                this.m$_activate.is_activated = true;
                this.m$_activate.is_deactivated = false;
            }
            else if (!should_activate && !this.m$_activate.is_deactivated) {
                this.m$_log('Deactivate');
                this.deactivate();
                this.m$_activate.is_activated = false;
                this.m$_activate.is_deactivated = true;
            }
        }
    },

    data: function () {
        return {
            m$_activate : {
                is_activated: null,
                is_deactivated: null,
            },
            m$_cache : {},
            m$_is_debug: false
        }
    }

};
