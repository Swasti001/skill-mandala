/*
 * Decompiled with CFR 0.152.
 */
package com.example.demo.exception;

import java.util.Map;

public class ValidationException
extends Exception {
    private Map<String, String> errors;

    public ValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return this.errors;
    }
}

