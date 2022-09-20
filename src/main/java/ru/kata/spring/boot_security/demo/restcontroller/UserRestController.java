package ru.kata.spring.boot_security.demo.restcontroller;

import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exeptionhandling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userService.finedAll();
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable long id) {
         User user = userService.findById(id);
         if (user==null){
             throw new NoSuchUserException("There is no user with ID = "
                     + id + " in Database!");
         }
        return user;
    }

    @PostMapping("/user")
    public User addNewUser(@RequestBody User user){
        userService.saveUser(user);
        return user;
    }
    @PatchMapping("/user")
    public User updateUser (@RequestBody User user){
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable long id) {
        User user = userService.findById(id);
        if (user==null){
            throw new NoSuchUserException("There is no user with ID = "
                    + id + " in Database!");
        }
        userService.deleteById(id);
        return "User with ID = " + id + " was deleted!";
    }

    @GetMapping("/principal")
    public User viewAdminPage(Principal principal){
        return userService.findUserByEmail(principal.getName());
    }
}
