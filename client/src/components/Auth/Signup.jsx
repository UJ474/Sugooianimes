import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaFilm } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../api";

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateForm();
    if (v) {
      toast({ title: v, status: "warning", duration: 3000 });
      return;
    }

    try {
      setLoading(true);
      await signupUser({ username: form.username, email: form.email, password: form.password }, navigate);
      // signupUser alerts/navigates already; otherwise show a toast here.
    } catch (err) {
      const msg = err?.response?.data?.message || "Signup failed";
      toast({ title: msg, status: "error", duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box zIndex={20} minH="100vh" bgGradient="linear(to-br, gray.900, #0f1724)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box position="absolute" top="-6" left="-6" w="72" h="72" bg="purple.600" opacity="0.12" filter="blur(56px)" borderRadius="full" />
      <Box position="absolute" bottom="-6" right="-6" w="72" h="72" bg="blue.600" opacity="0.12" filter="blur(56px)" borderRadius="full" />

      <Box position="relative" zIndex={10} w="full" maxW="md">
        <Box textAlign="center" mb={6}>
          <HStack justify="center" spacing={3}>
            {/* <FaFilm size={28} color="#b794f4" /> */}
            <Heading size="lg" color="white">Sugooianime</Heading>
          </HStack>
          <Text color="gray.300" fontSize="sm">Join today to create your own anime library</Text>
        </Box>

        <Box
          bg="rgba(15, 23, 42, 0.6)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.04)"
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          backdropFilter="blur(8px)"
        >
          <Heading as="h2" size="md" mb={4} color="white" textAlign="center">
            Create your account
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username">
                <FormLabel color="gray.300" fontSize="sm">Full name</FormLabel>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                  bg="rgba(255,255,255,0.03)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  required
                />
              </FormControl>

              <FormControl id="email">
                <FormLabel color="gray.300" fontSize="sm">Email</FormLabel>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  bg="rgba(255,255,255,0.03)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  type="email"
                  required
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel color="gray.300" fontSize="sm">Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    bg="rgba(255,255,255,0.03)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <ViewOffIcon color="gray.200" /> : <ViewIcon color="gray.200" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="confirmPassword">
                <FormLabel color="gray.300" fontSize="sm">Confirm password</FormLabel>
                <InputGroup>
                  <Input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    bg="rgba(255,255,255,0.03)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => setShowConfirm((s) => !s)}>
                      {showConfirm ? <ViewOffIcon color="gray.200" /> : <ViewIcon color="gray.200" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="full"
                mt={2}
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                _hover={{ transform: "translateY(-2px)" }}
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" color="white" /> : "Create Account"}
              </Button>
            </VStack>
          </form>
        </Box>

        <Text mt={4} color="gray.400" fontSize="xs" textAlign="center">
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="purple.300" fontWeight="semibold">Sign in</ChakraLink>
        </Text>
      </Box>
    </Box>
  );
}