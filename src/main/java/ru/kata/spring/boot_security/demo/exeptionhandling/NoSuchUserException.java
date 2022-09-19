package ru.kata.spring.boot_security.demo.exeptionhandling;

public class NoSuchUserException extends RuntimeException {

    public NoSuchUserException(String message) {
        super(message);
    }
}
