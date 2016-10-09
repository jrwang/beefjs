"use strict"
jest.unmock('../store')
jest.unmock('../../action/action')
jest.unmock('lodash')
jest.unmock('extend')

import Store from '../store'
import Action from '../../action/action'
interface TestStoreState
{
    items : any[]
}

const RECEIVE_ITEMS = Action('RECEIVE_ITEMS', (rawItems : any[]) => {
    return rawItems
})

class TestStoreClass extends Store<TestStoreState>
{
    public listeners
    public state

    constructor()
    {
        super();

        this.state = {
            items: []
        }

        this.createItem = this.createItem.bind(this)
        this.receiveItems = this.receiveItems.bind(this)
        RECEIVE_ITEMS.bind(this, 'receiveItems')
    }

    createItem(id : number, title : string)
    {
        let item = {
            id: id,
            title: title
        }

        RECEIVE_ITEMS([item])
    }

    receiveItems(items)
    {
        let newState = this.newState()

        items.forEach((item : any) => {
            this.upsertItem(newState.items, item.id, item)
        })

        return newState
    }
}

const TestStore = new TestStoreClass()

describe('store', () => {
    const defaultState = {
        items: []
    }

    it('should have empty state', () => {
        expect(TestStore.state).toEqual(defaultState)
    })
    
    let currentState = null

    const listener = jest.fn()

    TestStore.listen(listener)

    it('should have 1 listener', () => {
        expect(TestStore.listeners.length).toEqual(1)
    })

    const stateTwo = {
        items: [{
            __bID: 1,
            id: 1,
            title: 'test'
        }]
    }

    it('should do a state change and inform our listener only once', () => {
        TestStore.createItem(1, "test")
        expect(listener).lastCalledWith(stateTwo, defaultState)
        expect(listener.mock.calls.length).toBe(1)
    })

    it('should match our updated state', () => {
        expect(TestStore.state).toEqual(stateTwo)
    })
})