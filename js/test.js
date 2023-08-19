const testCC = { cc: "1234123412341234", mm: "08", yy: "12", cvv: "123" };
const tests = {
    payments: [{
        endpoint: "charge",
        requests: [
            { method: "POST", route: "charge", meta: { amount: "1.12", ...testCC }} 
        ]
    }, {
        endpoint: "authorize",
        requests: [ 
            { method: "POST", route: "authorize", meta: { amount: "10.00", ...testCC }},
        ]
    }, {
        endpoint: "settle",
        requests: [
            { method: "POST", route: "authorize", meta: { amount: "5.00", ...testCC }},
            { method: "POST", route: "settle", meta: { amount: "5.00", id: null }}
        ]
    }, {
        endpoint: "refund",
        requests: [
            { method: "POST", route: "charge", meta: { amount: "1.12", ...testCC }},
            { method: "POST", route: "refund", meta: { amount: "1.12", id: null }}
        ]
    }, {
        endpoint: "tokenize",
        requests: [
            { method: "POST", route: "tokenize", meta: testCC }
        ]
    }, {
        endpoint: "wallet",
        requests: [
            { method: "POST", route: "tokenize", meta: testCC },
            { method: "POST", route: "wallet", meta: { id: null } }
        ]
    }, {
        endpoint: "qr",
        requests: [
            { method: "GET", route: "qr" }
        ]
    }], subscriptions: [{
        endpoint: "subscription",
        requests: [
            { method: "POST", route: "subscription", meta: {
                email: "hello2@hello.com",
                amount: "1.11",
                trial: 1,
                start: "2023-08-01",
                interval: "daily",
                frequency: 1,
                payment: 'Test',
                ...testCC
            }}
        ]
    }], enrollments: [{
        endpoint: "enroll",
        requests: [
            { method: "POST", route: "enroll", meta: {
                dba_name: "TestCompany",
                email: "test@test.com",
                website: "www.tripleplaypay.com",
                fed_tx_id: 1234,
                legal_name: "TestName",
                start_date: "4/20/23",
                account_holder_name: "Name",
                account_type: "checking",
                account_number: 12345,
                routing_number: 123456,
                ownership_type: "LLC Public",
                business_description: "Test Store",
                business_phone_number: 5555551234,
                business_address_1: "123 Main St",
                business_address_2: "suite 102",
                business_city: "Nashville",
                business_state_province: "TN",
                business_postal_code: 12345,
                principle_first_name: "Steve",
                principle_last_name: "Stevens",
                princple_ssn: 123121234,
                princple_date_of_birth: "12/12/1234",
                principle_adddress_line_1: "123 Yellow St",
                princple_address_line_2: "Suite 2",
                princple_city: "Smithville",
                principle_state_province: "CA",
                principle_postal_code: 12345,
                princple_title: "Mr",
                priciple_ownership_percentage: 100,
                principle_phone_number: 5555551234
            } }
        ]
    // TERMINALS TESTS
    }], terminals: [{
        endpoint: "terminal",
        requests: [
            { method: "POST", route: "terminal", meta: { terminalId: "hello world" } },
        ]
    }, {
        endpoint: "terminal/reset",
        requests: [
            { method: "GET", route: "terminal" },
            { method: "POST", route: "terminal/reset", meta: { terminalId: null } }
        ]
    }, {
        endpoint: "terminal/remove",
        requests: [
            { method: "GET", route: "terminal" },
            { method: "POST", route: "terminal/remove", meta: { terminalId: null } }
        ]
    }], authentication: [{
        endpoint: "apikeys",
        requests: [
            { method: "GET", route: "apikeys" }
        ]
    }, {
        endpoint: "iframekey",
        requests: [
            { method: "GET", route: "iframekey" }
        ]
    }, {
        endpoint: "session",
        requests: [
            { method: "GET", route: "session" }
        ]
    }], reporting: [{
        endpoint: "clients",
        requests: [
            { method: "GET", route: "clients" }
        ]
    }, {
        endpoint: "documents",
        requests: [
            { method: "GET", route: "documents" }
        ]
    }, {
        endpoint: "form",
        requests: [
            { method: "GET", route: "form" }
        ]
    }, {
        endpoint: "receipt",
        requests: [
            { method: "GET", route: "receipt" }
        ]
    }, {
        endpoint: "report",
        requests: [
            { method: "GET", route: "report" }
        ]
    }, {
        endpoint: "report/statement",
        requests: [
            { method: "GET", route: "report/statement" }
        ]
    }]
};