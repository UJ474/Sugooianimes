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
  // useToast,
  Spinner,
  Link as ChakraLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../api";

export default function Signup() {
  const navigate = useNavigate();
  // const toast = useToast();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("success");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errMsg = validateForm();
    if (errMsg) {
      setModalStatus("error");
      setModalMessage(errMsg);
      setModalOpen(true);
      return;
    }

    try {
      await signupUser({ username: form.username, email: form.email, password: form.password });

      setModalStatus("success");
      setModalMessage("Account Created Successfully!");
      setModalOpen(true);

      setTimeout(() => navigate("/login"), 1400);

    } catch (err) {
      setModalStatus("error");
      setModalMessage(err.message);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100vw"
      overflow="hidden"
      zIndex={20}
      bgGradient="linear(to-br, gray.900, #0f1724)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
    >
      <Box
        position="absolute"
        top="-6"
        left="-6"
        w="72"
        h="72"
        bg="purple.600"
        opacity="0.12"
        filter="blur(56px)"
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-6"
        right="-6"
        w="72"
        h="72"
        bg="blue.600"
        opacity="0.12"
        filter="blur(56px)"
        borderRadius="full"
        pointerEvents="none"
      />

      <Box position="relative" maxW="md" w="full" zIndex={10}>
        <Box textAlign="center" mb={6}>
          <HStack justify="center">
            <Heading size="lg" color="white">
              Sugooianime
            </Heading>
          </HStack>
          <Text color="gray.300" fontSize="sm">
            Join today to build your anime library
          </Text>
        </Box>

        <Box
          bg="rgba(15, 23, 42, 0.6)"
          p={8}
          borderRadius="2xl"
          border="1px solid rgba(255,255,255,0.04)"
          backdropFilter="blur(8px)"
          boxShadow="xl"
        >
          <Heading as="h2" size="md" textAlign="center" color="white" mb={4}>
            Create your account
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color="gray.300" fontSize="sm">
                  Full name
                </FormLabel>
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

              <FormControl>
                <FormLabel color="gray.300" fontSize="sm">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  bg="rgba(255,255,255,0.03)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300" fontSize="sm">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    bg="rgba(255,255,255,0.03)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <ViewOffIcon color="gray.200" /> : <ViewIcon color="gray.200" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300" fontSize="sm">
                  Confirm password
                </FormLabel>
                <InputGroup>
                  <Input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    bg="rgba(255,255,255,0.03)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => setShowConfirm((p) => !p)}>
                      {showConfirm ? <ViewOffIcon color="gray.200" /> : <ViewIcon color="gray.200" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="full"
                mt={2}
                isDisabled={loading}
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                _hover={{ transform: "translateY(-2px)" }}
              >
                {loading ? <Spinner size="sm" color="white" /> : "Create Account"}
              </Button>
            </VStack>
          </form>
        </Box>

        <Text mt={4} color="gray.400" fontSize="xs" textAlign="center">
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="purple.300" fontWeight="semibold">
            Sign in
          </ChakraLink>
        </Text>
      </Box>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(50px)" />

        <ModalContent
          bg="rgba(15,23,42,0.9)"
          border="1px solid rgba(82,125,255,0.4)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          textAlign="center"
          p={6}
        >
          <ModalHeader color="white" fontSize="xl">
            {modalStatus === "success" ? "Success" : "Error"}
          </ModalHeader>

          <ModalBody>
            <Text fontSize="md" color="gray.200">
              {modalMessage}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.400" }}
              onClick={() => setModalOpen(false)}
              w="full"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}