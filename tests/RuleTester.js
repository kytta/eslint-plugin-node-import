const {describe, it, only} = require("node:test");
const { RuleTester } = require("eslint");

class NodeRuleTester extends RuleTester {
    constructor(config) {
        super(config);
        NodeRuleTester.describe = describe;
        NodeRuleTester.it = it;
        NodeRuleTester.itOnly = it.only;
    }
}

module.exports = {
    NodeRuleTester,
};