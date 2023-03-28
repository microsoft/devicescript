// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF
#define CTOR DEVS_BUILTIN_FLAG_IS_CTOR

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_array.c
value_t prop_Array_length(devs_ctx_t *ctx, value_t self);
void meth2_Array_insert(devs_ctx_t *ctx);
void fun1_Array_isArray(devs_ctx_t *ctx);
void methX_Array_push(devs_ctx_t *ctx);
void meth1_Array_pushRange(devs_ctx_t *ctx);
void methX_Array_slice(devs_ctx_t *ctx);
// impl_buffer.c
void fun1_Buffer_alloc(devs_ctx_t *ctx);
void fun1_Buffer_from(devs_ctx_t *ctx);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
void meth1_Buffer_toString(devs_ctx_t *ctx);
void meth3_Buffer_fillAt(devs_ctx_t *ctx);
void meth4_Buffer_blitAt(devs_ctx_t *ctx);
// impl_ds.c
void fun1_DeviceScript_sleep(devs_ctx_t *ctx);
void fun1_DeviceScript__panic(devs_ctx_t *ctx);
void fun0_DeviceScript_reboot(devs_ctx_t *ctx);
void fun0_DeviceScript_restart(devs_ctx_t *ctx);
void funX_DeviceScript_format(devs_ctx_t *ctx);
void fun2_DeviceScript_print(devs_ctx_t *ctx);
void fun1_DeviceScript_parseFloat(devs_ctx_t *ctx);
void fun1_DeviceScript_parseInt(devs_ctx_t *ctx);
void fun2_DeviceScript__logRepr(devs_ctx_t *ctx);
void fun1_DeviceScript__dcfgString(devs_ctx_t *ctx);
void fun0_DeviceScript_millis(devs_ctx_t *ctx);
// impl_error.c
void meth1_Error___ctor__(devs_ctx_t *ctx);
void meth1_RangeError___ctor__(devs_ctx_t *ctx);
void meth1_TypeError___ctor__(devs_ctx_t *ctx);
void meth1_SyntaxError___ctor__(devs_ctx_t *ctx);
value_t prop_Error_name(devs_ctx_t *ctx, value_t self);
void meth0_Error_print(devs_ctx_t *ctx);
// impl_fiber.c
value_t prop_DsFiber_id(devs_ctx_t *ctx, value_t self);
value_t prop_DsFiber_suspended(devs_ctx_t *ctx, value_t self);
void meth1_DsFiber_resume(devs_ctx_t *ctx);
void meth0_DsFiber_terminate(devs_ctx_t *ctx);
void fun1_DeviceScript_suspend(devs_ctx_t *ctx);
void fun0_DsFiber_self(devs_ctx_t *ctx);
// impl_function.c
void methX_Function_start(devs_ctx_t *ctx);
value_t prop_Function_prototype(devs_ctx_t *ctx, value_t self);
value_t prop_Function_name(devs_ctx_t *ctx, value_t self);
// impl_json.c
void fun2_JSON_parse(devs_ctx_t *ctx);
void fun3_JSON_stringify(devs_ctx_t *ctx);
// impl_math.c
void fun1_Math_ceil(devs_ctx_t *ctx);
void fun1_Math_floor(devs_ctx_t *ctx);
void fun1_Math_round(devs_ctx_t *ctx);
void fun1_Math_abs(devs_ctx_t *ctx);
void fun0_Math_random(devs_ctx_t *ctx);
void fun1_Math_randomInt(devs_ctx_t *ctx);
void fun1_Math_log(devs_ctx_t *ctx);
void fun2_Math_pow(devs_ctx_t *ctx);
void fun2_Math_idiv(devs_ctx_t *ctx);
void fun2_Math_imod(devs_ctx_t *ctx);
void fun2_Math_imul(devs_ctx_t *ctx);
void fun2_Math_min(devs_ctx_t *ctx);
void fun2_Math_max(devs_ctx_t *ctx);
// impl_object.c
void fun2_Object_assign(devs_ctx_t *ctx);
void fun1_Object_keys(devs_ctx_t *ctx);
void fun1_Object_values(devs_ctx_t *ctx);
void fun2_Object_setPrototypeOf(devs_ctx_t *ctx);
// impl_packet.c
value_t prop_Packet_role(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_deviceIdentifier(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_shortId(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_serviceIndex(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_serviceCommand(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_flags(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isCommand(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isReport(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_payload(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isEvent(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_eventCode(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isRegSet(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isRegGet(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_regCode(devs_ctx_t *ctx, value_t self);
value_t prop_Packet_isAction(devs_ctx_t *ctx, value_t self);
void meth0_Packet_decode(devs_ctx_t *ctx);
// impl_register.c
void meth0_DsRegister_read(devs_ctx_t *ctx);
void methX_DsRegister_write(devs_ctx_t *ctx);
value_t prop_DsPacketInfo_role(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_name(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_code(devs_ctx_t *ctx, value_t self);
void methX_DsCommand___func__(devs_ctx_t *ctx);
// impl_role.c
value_t prop_DsRole_isBound(devs_ctx_t *ctx, value_t self);
void meth2_DsRole_sendCommand(devs_ctx_t *ctx);
void meth0_DsRole_wait(devs_ctx_t *ctx);
// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
void meth1_String_charCodeAt(devs_ctx_t *ctx);
void meth1_String_charAt(devs_ctx_t *ctx);
void meth2_String_slice(devs_ctx_t *ctx);

static const devs_builtin_proto_entry_t Array_prototype_entries[] = { //
    {N(LENGTH), 50000},                                               //
    {N(INSERT), 50001},                                               //
    {N(PUSH), 50003},                                                 //
    {N(PUSHRANGE), 50004},                                            //
    {N(SLICE), 50005},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t Array_entries[] = { //
    {N(ISARRAY), 50002},                                    //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 50006},                                       //
    {N(FROM), 50007},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 50008},                                                //
    {N(TOSTRING), 50009},                                              //
    {N(FILLAT), 50010},                                                //
    {N(BLITAT), 50011},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEP), 50012},                                             //
    {N(_PANIC), 50013},                                            //
    {N(REBOOT), 50014},                                            //
    {N(RESTART), 50015},                                           //
    {N(FORMAT), 50016},                                            //
    {N(PRINT), 50017},                                             //
    {N(PARSEFLOAT), 50018},                                        //
    {N(PARSEINT), 50019},                                          //
    {N(_LOGREPR), 50020},                                          //
    {N(_DCFGSTRING), 50021},                                       //
    {N(MILLIS), 50022},                                            //
    {N(SUSPEND), 50033},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50025},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50024},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_entries[] = { //
    {N(__FUNC__), 50023},                                   //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50023},                                          //
    {N(NAME), 50027},                                                 //
    {N(PRINT), 50028},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_entries[] = { //
    {N(__FUNC__), 50024},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_entries[] = { //
    {N(__FUNC__), 50025},                                       //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_entries[] = { //
    {N(__FUNC__), 50026},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50026},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_prototype_entries[] = { //
    {N(ID), 50029},                                                     //
    {N(SUSPENDED), 50030},                                              //
    {N(RESUME), 50031},                                                 //
    {N(TERMINATE), 50032},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_entries[] = { //
    {N(SELF), 50034},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Function_prototype_entries[] = { //
    {N(START), 50035},                                                   //
    {N(PROTOTYPE), 50036},                                               //
    {N(NAME), 50037},                                                    //
    {0, 0}};

static const devs_builtin_proto_entry_t JSON_entries[] = { //
    {N(PARSE), 50038},                                     //
    {N(STRINGIFY), 50039},                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 50040},                                      //
    {N(FLOOR), 50041},                                     //
    {N(ROUND), 50042},                                     //
    {N(ABS), 50043},                                       //
    {N(RANDOM), 50044},                                    //
    {N(RANDOMINT), 50045},                                 //
    {N(LOG), 50046},                                       //
    {N(POW), 50047},                                       //
    {N(IDIV), 50048},                                      //
    {N(IMOD), 50049},                                      //
    {N(IMUL), 50050},                                      //
    {N(MIN), 50051},                                       //
    {N(MAX), 50052},                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t Object_entries[] = { //
    {N(ASSIGN), 50053},                                      //
    {N(KEYS), 50054},                                        //
    {N(VALUES), 50055},                                      //
    {N(SETPROTOTYPEOF), 50056},                              //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Packet_prototype_entries[] = { //
    {N(ROLE), 50057},                                                  //
    {N(DEVICEIDENTIFIER), 50058},                                      //
    {N(SHORTID), 50059},                                               //
    {N(SERVICEINDEX), 50060},                                          //
    {N(SERVICECOMMAND), 50061},                                        //
    {N(FLAGS), 50062},                                                 //
    {N(ISCOMMAND), 50063},                                             //
    {N(ISREPORT), 50064},                                              //
    {N(PAYLOAD), 50065},                                               //
    {N(ISEVENT), 50066},                                               //
    {N(EVENTCODE), 50067},                                             //
    {N(ISREGSET), 50068},                                              //
    {N(ISREGGET), 50069},                                              //
    {N(REGCODE), 50070},                                               //
    {N(ISACTION), 50071},                                              //
    {N(DECODE), 50072},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRegister_prototype_entries[] = { //
    {N(READ), 50073},                                                      //
    {N(WRITE), 50074},                                                     //
    {0, 0}};

static const devs_builtin_proto_entry_t DsCommand_prototype_entries[] = { //
    {N(__FUNC__), 50078},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t DsEvent_prototype_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketInfo_prototype_entries[] = { //
    {N(ROLE), 50075},                                                        //
    {N(NAME), 50076},                                                        //
    {N(CODE), 50077},                                                        //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRole_prototype_entries[] = { //
    {N(ISBOUND), 50079},                                               //
    {N(SENDCOMMAND), 50080},                                           //
    {N(WAIT), 50081},                                                  //
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 50082},                                                //
    {N(CHARCODEAT), 50083},                                            //
    {N(CHARAT), 50084},                                                //
    {N(SLICE), 50085},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t empty_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t string_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t number_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dsrole_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t function_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t boolean_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t packet_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_PACKET_PROTOTYPE},    //
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Array_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ARRAY] = {DEVS_BUILTIN_PROTO_INIT, NULL, Array_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, NULL, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, NULL, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         TypeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         RangeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, Error_entries},
    [DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Error_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, RangeError_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, TypeError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, SyntaxError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                   SyntaxError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                               DsFiber_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, DsFiber_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                Function_prototype_entries},
    [DEVS_BUILTIN_OBJECT_JSON] = {DEVS_BUILTIN_PROTO_INIT, NULL, JSON_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, NULL, Math_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT] = {DEVS_BUILTIN_PROTO_INIT, NULL, Object_entries},
    [DEVS_BUILTIN_OBJECT_PACKET_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              Packet_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsRegister_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsCommand_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsEvent_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                    DsPacketInfo_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              DsRole_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              String_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING] = {DEVS_BUILTIN_PROTO_INIT, NULL, string_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, number_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE] = {DEVS_BUILTIN_PROTO_INIT, NULL, dsrole_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION] = {DEVS_BUILTIN_PROTO_INIT, NULL, function_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN] = {DEVS_BUILTIN_PROTO_INIT, NULL, boolean_entries},
    [DEVS_BUILTIN_OBJECT_PACKET] = {DEVS_BUILTIN_PROTO_INIT, NULL, packet_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
};

uint16_t devs_num_builtin_functions = 86;
const devs_builtin_function_t devs_builtin_functions[86] = {
    {N(LENGTH), 0, PROP, {.prop = prop_Array_length}},
    {N(INSERT), 2, 0, {.meth = meth2_Array_insert}},
    {N(ISARRAY), 1, NO_SELF, {.meth = fun1_Array_isArray}},
    {N(PUSH), 0, 0, {.meth = methX_Array_push}},
    {N(PUSHRANGE), 1, 0, {.meth = meth1_Array_pushRange}},
    {N(SLICE), 0, 0, {.meth = methX_Array_slice}},
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(FROM), 1, NO_SELF, {.meth = fun1_Buffer_from}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 1, 0, {.meth = meth1_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(SLEEP), 1, NO_SELF, {.meth = fun1_DeviceScript_sleep}},
    {N(_PANIC), 1, NO_SELF, {.meth = fun1_DeviceScript__panic}},
    {N(REBOOT), 0, NO_SELF, {.meth = fun0_DeviceScript_reboot}},
    {N(RESTART), 0, NO_SELF, {.meth = fun0_DeviceScript_restart}},
    {N(FORMAT), 0, NO_SELF, {.meth = funX_DeviceScript_format}},
    {N(PRINT), 2, NO_SELF, {.meth = fun2_DeviceScript_print}},
    {N(PARSEFLOAT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseFloat}},
    {N(PARSEINT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseInt}},
    {N(_LOGREPR), 2, NO_SELF, {.meth = fun2_DeviceScript__logRepr}},
    {N(_DCFGSTRING), 1, NO_SELF, {.meth = fun1_DeviceScript__dcfgString}},
    {N(MILLIS), 0, NO_SELF, {.meth = fun0_DeviceScript_millis}},
    {N(ERROR), 1, CTOR, {.meth = meth1_Error___ctor__}},
    {N(RANGEERROR), 1, CTOR, {.meth = meth1_RangeError___ctor__}},
    {N(TYPEERROR), 1, CTOR, {.meth = meth1_TypeError___ctor__}},
    {N(SYNTAXERROR), 1, CTOR, {.meth = meth1_SyntaxError___ctor__}},
    {N(NAME), 0, PROP, {.prop = prop_Error_name}},
    {N(PRINT), 0, 0, {.meth = meth0_Error_print}},
    {N(ID), 0, PROP, {.prop = prop_DsFiber_id}},
    {N(SUSPENDED), 0, PROP, {.prop = prop_DsFiber_suspended}},
    {N(RESUME), 1, 0, {.meth = meth1_DsFiber_resume}},
    {N(TERMINATE), 0, 0, {.meth = meth0_DsFiber_terminate}},
    {N(SUSPEND), 1, NO_SELF, {.meth = fun1_DeviceScript_suspend}},
    {N(SELF), 0, NO_SELF, {.meth = fun0_DsFiber_self}},
    {N(START), 0, 0, {.meth = methX_Function_start}},
    {N(PROTOTYPE), 0, PROP, {.prop = prop_Function_prototype}},
    {N(NAME), 0, PROP, {.prop = prop_Function_name}},
    {N(PARSE), 2, NO_SELF, {.meth = fun2_JSON_parse}},
    {N(STRINGIFY), 3, NO_SELF, {.meth = fun3_JSON_stringify}},
    {N(CEIL), 1, NO_SELF, {.meth = fun1_Math_ceil}},
    {N(FLOOR), 1, NO_SELF, {.meth = fun1_Math_floor}},
    {N(ROUND), 1, NO_SELF, {.meth = fun1_Math_round}},
    {N(ABS), 1, NO_SELF, {.meth = fun1_Math_abs}},
    {N(RANDOM), 0, NO_SELF, {.meth = fun0_Math_random}},
    {N(RANDOMINT), 1, NO_SELF, {.meth = fun1_Math_randomInt}},
    {N(LOG), 1, NO_SELF, {.meth = fun1_Math_log}},
    {N(POW), 2, NO_SELF, {.meth = fun2_Math_pow}},
    {N(IDIV), 2, NO_SELF, {.meth = fun2_Math_idiv}},
    {N(IMOD), 2, NO_SELF, {.meth = fun2_Math_imod}},
    {N(IMUL), 2, NO_SELF, {.meth = fun2_Math_imul}},
    {N(MIN), 2, NO_SELF, {.meth = fun2_Math_min}},
    {N(MAX), 2, NO_SELF, {.meth = fun2_Math_max}},
    {N(ASSIGN), 2, NO_SELF, {.meth = fun2_Object_assign}},
    {N(KEYS), 1, NO_SELF, {.meth = fun1_Object_keys}},
    {N(VALUES), 1, NO_SELF, {.meth = fun1_Object_values}},
    {N(SETPROTOTYPEOF), 2, NO_SELF, {.meth = fun2_Object_setPrototypeOf}},
    {N(ROLE), 0, PROP, {.prop = prop_Packet_role}},
    {N(DEVICEIDENTIFIER), 0, PROP, {.prop = prop_Packet_deviceIdentifier}},
    {N(SHORTID), 0, PROP, {.prop = prop_Packet_shortId}},
    {N(SERVICEINDEX), 0, PROP, {.prop = prop_Packet_serviceIndex}},
    {N(SERVICECOMMAND), 0, PROP, {.prop = prop_Packet_serviceCommand}},
    {N(FLAGS), 0, PROP, {.prop = prop_Packet_flags}},
    {N(ISCOMMAND), 0, PROP, {.prop = prop_Packet_isCommand}},
    {N(ISREPORT), 0, PROP, {.prop = prop_Packet_isReport}},
    {N(PAYLOAD), 0, PROP, {.prop = prop_Packet_payload}},
    {N(ISEVENT), 0, PROP, {.prop = prop_Packet_isEvent}},
    {N(EVENTCODE), 0, PROP, {.prop = prop_Packet_eventCode}},
    {N(ISREGSET), 0, PROP, {.prop = prop_Packet_isRegSet}},
    {N(ISREGGET), 0, PROP, {.prop = prop_Packet_isRegGet}},
    {N(REGCODE), 0, PROP, {.prop = prop_Packet_regCode}},
    {N(ISACTION), 0, PROP, {.prop = prop_Packet_isAction}},
    {N(DECODE), 0, 0, {.meth = meth0_Packet_decode}},
    {N(READ), 0, 0, {.meth = meth0_DsRegister_read}},
    {N(WRITE), 0, 0, {.meth = methX_DsRegister_write}},
    {N(ROLE), 0, PROP, {.prop = prop_DsPacketInfo_role}},
    {N(NAME), 0, PROP, {.prop = prop_DsPacketInfo_name}},
    {N(CODE), 0, PROP, {.prop = prop_DsPacketInfo_code}},
    {N(__FUNC__), 0, 0, {.meth = methX_DsCommand___func__}},
    {N(ISBOUND), 0, PROP, {.prop = prop_DsRole_isBound}},
    {N(SENDCOMMAND), 2, 0, {.meth = meth2_DsRole_sendCommand}},
    {N(WAIT), 0, 0, {.meth = meth0_DsRole_wait}},
    {N(LENGTH), 0, PROP, {.prop = prop_String_length}},
    {N(CHARCODEAT), 1, 0, {.meth = meth1_String_charCodeAt}},
    {N(CHARAT), 1, 0, {.meth = meth1_String_charAt}},
    {N(SLICE), 2, 0, {.meth = meth2_String_slice}}};

STATIC_ASSERT(4 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(50000 == DEVS_FIRST_BUILTIN_FUNCTION);
